const apiUrl = "http://localhost:3000";

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
      const response = await fetch(`${apiUrl}/players`, {
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

      // Limpa os campos do formulário
      document.getElementById("createForm").reset();
      alert("Jogador criado com sucesso");
      // Listar jogadores após a criação
      await listarJogadores();
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
      const li = document.createElement("li");
      li.innerHTML = `ID: ${jogador.identificador} <br>
      Nome: ${jogador.nome}<br>
      Apelido: ${jogador.apelido}<br>
      Data de Criação: ${dataFormatada}`;
      jogadoresList.appendChild(li);
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
    // Verifica se o query é um ID e usa a rota específica se for o caso
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

    resultadoBusca.innerHTML = `
      <p><strong>ID:</strong> ${jogador.identificador}</p>
      <p><strong>Nome:</strong> ${jogador.nome}</p>
      <p><strong>Apelido:</strong> ${jogador.apelido}</p>
      <p><strong>Data de Criação:</strong> ${dataCriacao}</p>
      <p><strong>Força:</strong> ${jogador.habilidades.forca}</p>
      <p><strong>Velocidade:</strong> ${jogador.habilidades.velocidade}</p>
      <p><strong>Drible:</strong> ${jogador.habilidades.drible}</p>
    `;
    document.getElementById("searchQuery").value = "";
  } catch (error) {
    console.error("Erro:", error);
    resultadoBusca.innerHTML = `<p>Jogador não encontrado.</p>`;
    document.getElementById("searchQuery").value = "";
  }
}

function limparBusca() {
  const resultadoBusca = document.getElementById("resultadoBusca");
  resultadoBusca.innerHTML = "";
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
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar jogador: preencha os campos corretamente`);
        document.getElementById("updateForm").reset();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(
        "Erro ao atualizar jogador. Verifique o console para mais detalhes."
      );
    }
  });

document
  .getElementById("deleteForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("deleteId").value;

    try {
      const response = await fetch(`${apiUrl}/players/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Jogador deletado com sucesso!");
        listarJogadores();
        document.getElementById("deleteForm").reset();
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar jogador`);
        document.getElementById("deleteForm").reset();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao deletar jogador. Verifique o console para mais detalhes.");
    }
  });

listarJogadores();
