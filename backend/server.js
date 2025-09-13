const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const Tarefa = require('./models/Tarefa');
const tarefasRoutes = require('./routes/tarefas');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/tarefas', tarefasRoutes);

// Sincronizar banco e iniciar servidor
sequelize.sync().then(() => {
  console.log('Banco sincronizado');
  app.listen(5000, () => {
    console.log('Servidor rodando em http://192.168.1.7:5500/');
  });
}).catch(err => {
  console.error('Erro ao conectar no banco:', err);
});
