// controllers/jogadorController.js
const Jogador = require("../models/jogador");
const Joi = require("joi");

// Validação dos dados do jogador
const jogadorSchema = Joi.object({
  nome: Joi.string().required(),
  apelido: Joi.string().optional(),
  habilidades: Joi.object({
    forca: Joi.number().integer().min(0).max(10).required(),
    velocidade: Joi.number().integer().min(0).max(10).required(),
    drible: Joi.number().integer().min(0).max(10).optional(),
  }).required(),
});

// Criar jogador
exports.criarJogador = async (req, res) => {
  const { error } = jogadorSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  try {
    const novoJogador = await Jogador.create(req.body);
    res.status(201).json(novoJogador);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar jogador" });
  }
};

// Listar jogadores com busca por nome e apelido
exports.listarJogadores = async (req, res) => {
  const { nome, apelido, page = 1, limit = 10 } = req.query;
  const query = {};
  if (nome) query.nome = new RegExp(nome, "i");
  if (apelido) query.apelido = new RegExp(apelido, "i");

  try {
    const jogadores = await Jogador.find(query)
      .select("identificador nome apelido data_criacao")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(jogadores);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar jogadores" });
  }
};

// Buscar jogador por identificador
exports.buscarJogadorPorId = async (req, res) => {
  try {
    // Busca o jogador pelo identificador na URL e inclui todas as informações
    const jogador = await Jogador.findOne({ identificador: req.params.id });

    if (!jogador) {
      return res.status(404).json({ erro: "Jogador não encontrado" });
    }

    res.json(jogador);
  } catch (err) {
    console.error("Erro ao buscar jogador:", err);
    res.status(500).json({ erro: "Erro ao buscar jogador" });
  }
};

// Atualizar jogador
exports.atualizarJogador = async (req, res) => {
  const { error } = jogadorSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  try {
    const jogador = await Jogador.findOneAndUpdate(
      { identificador: req.params.id },
      req.body,
      { new: true }
    );
    if (!jogador)
      return res.status(404).json({ erro: "Jogador não encontrado" });
    res.json(jogador);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar jogador" });
  }
};

// Remover jogador
exports.removerJogador = async (req, res) => {
  try {
    const jogador = await Jogador.findOneAndDelete({
      identificador: req.params.id,
    });
    if (!jogador)
      return res.status(404).json({ erro: "Jogador não encontrado" });
    res.json({ mensagem: "Jogador removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover jogador" });
  }
};
