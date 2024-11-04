// routes/jogadorRoutes.js
const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogadorController');

router.post('/', jogadorController.criarJogador);
router.get('/', jogadorController.listarJogadores);
router.get('/:id', jogadorController.buscarJogadorPorId);
router.put('/:id', jogadorController.atualizarJogador);
router.delete('/:id', jogadorController.removerJogador);

module.exports = router;
