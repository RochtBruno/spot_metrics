const apiUrl = window.location.host;

document
  .getElementById("createForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const forca = document.getElementById("forca").value;
    const velocidade = document.getElementById("velocidade").value;
    const drible = document.getElementById("drible").value;

    if (!name || !forca || !velocidade || !drible) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch(`${env.API_BASE_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          apelido: nickname,
          habilidades: {
            forca: parseInt(forca),
            velocidade: parseInt(velocidade),
            drible: parseInt(drible),
          },
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar jogador");

      alert("Jogador criado com sucesso");
      await listarJogadores();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createPlayerModal")
      );
      modal.hide();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar jogador. Verifique o console.");
      document.getElementById("createForm").reset();
    }
  });

async function listarJogadores() {
  try {
    const response = await fetch(`${apiUrl}/players`);
    if (!response.ok) throw new Error("Erro ao carregar a lista de jogadores");

    const jogadores = await response.json();
    const jogadoresList = document.getElementById("jogadoresList");
    jogadoresList.innerHTML = "";

    jogadores.forEach((jogador) => {
      const dataCriacao = new Date(jogador.data_criacao); // Converter a data para objeto Date
      const dataFormatada = dataCriacao.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");

      card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${jogador.nome}</h5>
          <p class="card-text">
            <strong>ID:</strong> ${jogador.identificador} <br>
            <strong>Apelido:</strong> ${jogador.apelido} <br>
            <strong>Data de Criação:</strong> ${dataFormatada}
          </p>
          <button class="btn btn-primary" onclick="abrirModalAtualizar('${jogador.identificador}', '${jogador.nome}', '${jogador.apelido}')">Atualizar</button>
          <button class="btn btn-danger" onclick="deletarJogador('${jogador.identificador}')">Deletar</button>
        </div>
      </div>
    `;

      jogadoresList.appendChild(card);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar jogadores. Verifique o console.");
  }
}

async function buscarJogador() {
  const query = document.getElementById("searchQuery").value.trim();
  const resultadoBusca = document.getElementById("resultadoBusca");
  resultadoBusca.innerHTML = "";

  try {
    const response = await fetch(`${apiUrl}/players/${query}`);
    if (!response.ok) throw new Error("Jogador não encontrado");

    const jogador = await response.json();

    const dataCriacao = new Date(jogador.data_criacao).toLocaleDateString(
      "pt-BR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

    // Criar o card com as informações do jogador
    resultadoBusca.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">${jogador.nome} (${jogador.apelido})</h5>
          <button id="closeCard" class="btn btn-danger btn-sm float-end">Fechar</button>
        </div>
        <div class="card-body">
          <p class="card-text"><strong>ID:</strong> ${jogador.identificador}</p>
          <p class="card-text"><strong>Data de Criação:</strong> ${dataCriacao}</p>
          <p class="card-text"><strong>Força:</strong> ${jogador.habilidades.forca}</p>
          <p class="card-text"><strong>Velocidade:</strong> ${jogador.habilidades.velocidade}</p>
          <p class="card-text"><strong>Drible:</strong> ${jogador.habilidades.drible}</p>
        </div>
      </div>
    `;
    document.getElementById("closeCard").addEventListener("click", function () {
      resultadoBusca.innerHTML = ""; // Limpa o conteúdo do card
      document.getElementById("searchQuery").value = ""; // Limpa a barra de busca
    });
  } catch (error) {
    console.error("Erro:", error);
    resultadoBusca.innerHTML = `<p>Jogador não encontrado.</p>`;
    document.getElementById("searchQuery").value = "";
  }
}

document
  .getElementById("button-addon2")
  .addEventListener("click", buscarJogador);

// Função para abrir o modal de atualização e preencher os campos
function abrirModalAtualizar(id, nome, apelido) {
  // Preencha os campos com as informações do jogador
  document.getElementById("updateId").value = id;
  document.getElementById("updateName").value = nome;
  document.getElementById("updateNickname").value = apelido;

  // Exibir o modal
  const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
  modal.show();
}

document
  .getElementById("updateForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("updateId").value;
    const name = document.getElementById("updateName").value;
    const nickname = document.getElementById("updateNickname").value;
    const forca = document.getElementById("updateForca").value;
    const velocidade = document.getElementById("updateVelocidade").value;
    const drible = document.getElementById("updateDrible").value;

    try {
      const response = await fetch(`${apiUrl}/players/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          apelido: nickname,
          habilidades: {
            forca: parseInt(forca),
            velocidade: parseInt(velocidade),
            drible: parseInt(drible),
          },
        }),
      });

      if (response.ok) {
        alert("Jogador atualizado com sucesso!");
        listarJogadores();
        document.getElementById("updateForm").reset();

        // Fechar o modal após a atualização
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("staticBackdrop")
        );
        modal.hide();
      } else {
        alert("Erro ao atualizar jogador: preencha os campos corretamente");
        document.getElementById("updateForm").reset();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(
        "Erro ao atualizar jogador. Verifique o console para mais detalhes."
      );
    }
  });

async function deletarJogador(id) {
  try {
    const response = await fetch(`${apiUrl}/players/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Jogador deletado com sucesso!");
      listarJogadores(); // Atualiza a lista de jogadores após a exclusão
    } else {
      alert("Erro ao deletar jogador");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao deletar jogador. Verifique o console para mais detalhes.");
  }
}

listarJogadores();
