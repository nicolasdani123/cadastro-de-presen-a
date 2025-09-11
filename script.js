const diasSemana = document.querySelectorAll(".dia");
const result = document.querySelector(".container-result");
const registrar = document.querySelector(".registrar");
const inputNome = document.querySelector(".inputValue");
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
  const nome = inputNome.value.trim();
  if (!nome) {
    alert("Por favor, digite seu nome.");
    return;
  }

  const diasSelecionados = [...document.querySelectorAll(".dia.active")].map(d => d.textContent);
  if (diasSelecionados.length === 0) {
    alert("Selecione pelo menos um dia.");
    return;
  }

  const confirmar = confirm(`Confirmar registro de ${nome} nos dias: ${diasSelecionados.join(", ")}?`);
  if (!confirmar) return;

  const usuarios = pegarUsuarios();
  usuarios.push({ nome, dias: diasSelecionados });
  salvarUsuarios(usuarios);

  inputNome.value = "";
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

    const nomeEl = document.createElement("h3");
    nomeEl.textContent = nome;
    card.appendChild(nomeEl);

    const diasContainer = document.createElement("div");
    diasContainer.className = "dias-result";

    dias.forEach(dia => {
      const diaEl = document.createElement("span");
      diaEl.className = "dia-result";
      diaEl.textContent = dia;
      diasContainer.appendChild(diaEl);
    });

    card.appendChild(diasContainer);

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const iconEditar = document.createElement("span");
    iconEditar.className = "icon editar";
    iconEditar.title = "Editar";
    iconEditar.innerHTML = "✏️";
    iconEditar.onclick = () => editarUsuario(index);

    const iconExcluir = document.createElement("span");
    iconExcluir.className = "icon excluir";
    iconExcluir.title = "Excluir";
    iconExcluir.innerHTML = "🗑️";
    iconExcluir.onclick = () => excluirUsuario(index);

    actions.appendChild(iconEditar);
    actions.appendChild(iconExcluir);
    card.appendChild(actions);

    result.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", renderizarResultados);
registrar.addEventListener("click", registrarUsuario);
