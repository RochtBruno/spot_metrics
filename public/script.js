const apiUrl = "http://localhost:3000";

// Função para criar jogador
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

    // Tente criar um jogador e depois listar todos os jogadores
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

      // Listar jogadores após a criação
      await listarJogadores();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar jogador. Verifique o console.");
    }
  });

// Função para listar jogadores
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
        li.textContent = `ID: ${jogador.identificador}, Nome: ${jogador.nome}, Apelido: ${jogador.apelido}, Data de Criação: ${dataFormatada}`;
        jogadoresList.appendChild(li);
      });
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar jogadores. Verifique o console.");
    }
  }
  
// Função para atualizar jogador
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
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao atualizar jogador: ${
            errorData.message || "Erro desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(
        "Erro ao atualizar jogador. Verifique o console para mais detalhes."
      );
    }
  });

// Função para deletar jogador
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
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao deletar jogador: ${errorData.message || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao deletar jogador. Verifique o console para mais detalhes.");
    }
  });

// Carrega a lista de jogadores ao iniciar a página
listarJogadores();
