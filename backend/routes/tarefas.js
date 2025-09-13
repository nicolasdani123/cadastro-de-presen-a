const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');

// Criar tarefa
router.post('/', async (req, res) => {
  try {
    const tarefa = await Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todas
router.get('/', async (req, res) => {
  const tarefas = await Tarefa.findAll();
  res.json(tarefas);
});

// Buscar por ID
router.get('/:id', async (req, res) => {
  const tarefa = await Tarefa.findByPk(req.params.id);
  if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });
  res.json(tarefa);
});

// Atualizar
router.put('/:id', async (req, res) => {
  const tarefa = await Tarefa.findByPk(req.params.id);
  if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });

  await tarefa.update(req.body);
  res.json(tarefa);
});

// Deletar
router.delete('/:id', async (req, res) => {
  const tarefa = await Tarefa.findByPk(req.params.id);
  if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });

  await tarefa.destroy();
  res.json({ message: 'Tarefa removida com sucesso' });
});

module.exports = router;
