// models/jogador.js
const { required } = require("joi");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HabilidadeSchema = new mongoose.Schema({
  forca: { type: Number, required: true, min: 0, max: 10 },
  velocidade: { type: Number, required: true, min: 0, max: 10 },
  drible: { type: Number, min: 0, max: 10 },
});

const JogadorSchema = new mongoose.Schema({
  identificador: { type: String, required:true, default: uuidv4 },
  nome: { type: String, required: true },
  apelido: { type: String },
  data_criacao: { type: Date, required:true, default: Date.now },
  habilidades: { type: HabilidadeSchema, required: true },
});

module.exports = mongoose.model("Jogador", JogadorSchema);
