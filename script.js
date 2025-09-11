const diasSemana = document.querySelectorAll(".dia");
const result = document.querySelector(".container-result");
const registrar = document.querySelector(".registrar");
const key = "usuarios-data";

diasSemana.forEach(dia => {
  dia.addEventListener("click", () => {
    const ativos = document.querySelectorAll(".dia.active");
    dia.classList.toggle("active");

    if (ativos.length >= 2 && dia.classList.contains("active")) {
      dia.classList.remove("active");
    }
  });
});

function registrarUsuario() {
  const nome = prompt("Digite seu nome:")?.trim();
  if (!nome) return;

  const diasSelecionados = [...document.querySelectorAll(".dia.active")].map(d => d.textContent);
  if (diasSelecionados.length === 0) {
    alert("Selecione pelo menos um dia.");
    return;
  }

  const usuarios = pegarUsuarios();
  usuarios.push({ nome, dias: diasSelecionados });
  salvarUsuarios(usuarios);

  diasSemana.forEach(d => d.classList.remove("active"));
  renderizarResultados();
}

function editarUsuario(index) {
  const usuarios = pegarUsuarios();
  const atual = usuarios[index];

  const novoNome = prompt("Editar nome:", atual.nome)?.trim();
  if (!novoNome) return;

  const novosDias = prompt("Editar dias (separados por espaço):", atual.dias.join(" "))?.trim();
  if (!novosDias) return;

  const diasArray = novosDias.split(" ").slice(0, 2); 
  usuarios[index] = { nome: novoNome, dias: diasArray };
  salvarUsuarios(usuarios);
  renderizarResultados();
}

function excluirUsuario(index) {
  const usuarios = pegarUsuarios();
  usuarios.splice(index, 1);
  salvarUsuarios(usuarios);
  renderizarResultados();
}

function pegarUsuarios() {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(key, JSON.stringify(usuarios));
}

function renderizarResultados() {
  const usuarios = pegarUsuarios();
  result.innerHTML = "";

  usuarios.forEach(({ nome, dias }, index) => {
    const card = document.createElement("div");
    card.className = "result";

    card.innerHTML = `
      <h3>${nome}</h3>
      <p>${dias.join(" ")}</p>
      <button onclick="editarUsuario(${index})">Editar</button>
      <button onclick="excluirUsuario(${index})">Excluir</button>
    `;

    result.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", renderizarResultados);
registrar.addEventListener("click", registrarUsuario);
