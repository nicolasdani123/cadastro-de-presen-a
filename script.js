const key = "usuarios-data"
const inputNome = document.querySelector(".inputValue")
const registrar = document.querySelector(".registrar")
const result = document.querySelector(".container-result")
const titulo = document.getElementById("tituloPagina")
let indiceEditando = null

function configurarSelecaoDias(container) {
  const dias = document.querySelectorAll(`${container} .dia`)
  dias.forEach(dia => {
    dia.addEventListener("click", () => {
      const ativos = [...dias].filter(d => d.classList.contains("active"))
      dia.classList.toggle("active")
      if (ativos.length >= 2 && dia.classList.contains("active")) {
        dia.classList.remove("active")
      }
    })
  })
}

configurarSelecaoDias(".dias-principal")
configurarSelecaoDias(".dias-edicao")

function pegarUsuarios() {
  return JSON.parse(localStorage.getItem(key)) || []
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(key, JSON.stringify(usuarios))
}

function registrarUsuario() {
  const nome = inputNome.value.trim()
  if (!nome) return alert("Digite seu nome.")
  const diasSelecionados = [...document.querySelectorAll(".dias-principal .dia.active")].map(d => d.textContent)
  if (diasSelecionados.length === 0) return alert("Selecione pelo menos um dia.")
  if (!confirm(`Confirmar registro de ${nome} nos dias: ${diasSelecionados.join(", ")}?`)) return
  const usuarios = pegarUsuarios()
  usuarios.push({ nome, dias: diasSelecionados })
  salvarUsuarios(usuarios)
  inputNome.value = ""
  document.querySelectorAll(".dias-principal .dia").forEach(d => d.classList.remove("active"))
  renderizarResultados()
}

function abrirTelaEdicao(index) {
  const usuario = pegarUsuarios()[index]
  indiceEditando = index
  titulo.textContent = "Editar Usuário"
  document.getElementById("editNome").value = usuario.nome
  document.getElementById("editNome").classList.add("input-edicao")
  document.querySelectorAll(".dias-edicao .dia").forEach(dia => {
    dia.classList.remove("active")
    if (usuario.dias.includes(dia.textContent)) {
      dia.classList.add("active")
    }
  })
  document.getElementById("telaPrincipal").style.display = "none"
  document.getElementById("telaEdicao").style.display = "block"
}

function fecharTelaEdicao() {
  titulo.textContent = "Trabalho Presencial"
  document.getElementById("editNome").classList.remove("input-edicao")
  document.getElementById("telaPrincipal").style.display = "block"
  document.getElementById("telaEdicao").style.display = "none"
  indiceEditando = null
}

function excluirUsuario(index) {
  const usuarios = pegarUsuarios()
  usuarios.splice(index, 1)
  salvarUsuarios(usuarios)
  renderizarResultados()
}

function renderizarResultados() {
  const usuarios = pegarUsuarios()
  result.innerHTML = ""
  usuarios.forEach(({ nome, dias }, index) => {
    const card = document.createElement("div")
    card.className = "result"
    const nomeEl = document.createElement("h3")
    nomeEl.textContent = nome
    card.appendChild(nomeEl)
    const diasContainer = document.createElement("div")
    diasContainer.className = "dias-result"
    dias.forEach(dia => {
      const diaEl = document.createElement("span")
      diaEl.className = "dia-result"
      diaEl.textContent = dia
      diasContainer.appendChild(diaEl)
    })
    card.appendChild(diasContainer)
    const actions = document.createElement("div")
    actions.className = "result-actions"
    const iconEditar = document.createElement("span")
    iconEditar.className = "icon editar"
    iconEditar.title = "Editar"
    iconEditar.innerHTML = "✏️"
    iconEditar.onclick = () => abrirTelaEdicao(index)
    const iconExcluir = document.createElement("span")
    iconExcluir.className = "icon excluir"
    iconExcluir.title = "Excluir"
    iconExcluir.innerHTML = "🗑️"
    iconExcluir.onclick = () => excluirUsuario(index)
    actions.appendChild(iconEditar)
    actions.appendChild(iconExcluir)
    card.appendChild(actions)
    result.appendChild(card)
  })
}

document.getElementById("salvarEdicao").addEventListener("click", () => {
  const novoNome = document.getElementById("editNome").value.trim()
  const novosDias = [...document.querySelectorAll(".dias-edicao .dia.active")].map(d => d.textContent).slice(0, 2)
  if (!novoNome || novosDias.length === 0) return alert("Preencha o nome e selecione até 2 dias.")
  const usuarios = pegarUsuarios()
  usuarios[indiceEditando] = { nome: novoNome, dias: novosDias }
  salvarUsuarios(usuarios)
  fecharTelaEdicao()
  renderizarResultados()
})

document.getElementById("cancelarEdicao").addEventListener("click", fecharTelaEdicao)
registrar.addEventListener("click", registrarUsuario)
window.addEventListener("DOMContentLoaded", renderizarResultados)
