const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Tarefa = sequelize.define('Tarefa', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diasSelecionados: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Tarefa
