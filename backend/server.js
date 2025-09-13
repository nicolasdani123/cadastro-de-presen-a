const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const tarefasRoutes = require('./routes/tarefas');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Rota para a raiz "/"
app.get('/', (req, res) => {
  res.send('🚀 API de Cadastro de Presença está rodando!');
});

// Rotas da API
app.use('/api/tarefas', tarefasRoutes);

// Porta do Render
const PORT = process.env.PORT || 10000;
sequelize.sync().then(() => {
  console.log('Banco sincronizado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
