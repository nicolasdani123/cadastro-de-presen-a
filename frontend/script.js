// =================== Elementos da Página ===================
const inputNome = document.querySelector(".inputValue");
const registrar = document.querySelector(".registrar");
const result = document.querySelector(".container-result");
const titulo = document.getElementById("tituloPagina");
let indiceEditando = null;

// =================== URL da API no Render ===================
const API_URL = "https://cadastro-de-presen-a.onrender.com/api/tarefas";

// =================== Seleção de Dias ===================
function configurarSelecaoDias(container) {
  const dias = document.querySelectorAll(`${container} .dia`);
  dias.forEach(dia => {
    dia.addEventListener("click", () => {
      const ativos = [...dias].filter(d => d.classList.contains("active"));
      dia.classList.toggle("active");
      if (ativos.length >= 2 && dia.classList.contains("active")) {
        dia.classList.remove("active");
      }
    });
  });
}

configurarSelecaoDias(".dias-principal");
configurarSelecaoDias(".dias-edicao");

// =================== Funções de API ===================
async function pegarUsuariosAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    const data = await response.json();
    return data.map(u => ({
      id: u.id,
      nome: u.nome,
      dias: u.diasSelecionados.split(",")
    }));
  } catch (err) {
    console.error("Erro ao conectar com a API:", err);
    return [];
  }
}

async function registrarUsuario() {
  const nome = inputNome.value.trim();
  if (!nome) return alert("Digite seu nome.");

  const diasSelecionados = [...document.querySelectorAll(".dias-principal .dia.active")]
    .map(d => d.textContent);
  if (diasSelecionados.length === 0) return alert("Selecione pelo menos um dia.");

  if (!confirm(`Confirmar registro de ${nome} nos dias: ${diasSelecionados.join(", ")}?`)) return;

  const tarefa = { nome, diasSelecionados: diasSelecionados.join(",") };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
    if (response.ok) {
      inputNome.value = "";
      document.querySelectorAll(".dias-principal .dia").forEach(d => d.classList.remove("active"));
      renderizarResultadosAPI();
    } else {
      alert("Erro ao registrar presença");
    }
  } catch (err) {
    console.error("Erro ao registrar:", err);
    alert("Erro de conexão com a API");
  }
}

async function atualizarUsuarioAPI(id, novoNome, novosDias) {
  const tarefa = { id, nome: novoNome, diasSelecionados: novosDias.join(",") };
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa)
    });
    if (!response.ok) alert("Erro ao atualizar usuário");
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    alert("Erro de conexão com a API");
  }
}

async function excluirUsuarioAPI(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) alert("Erro ao excluir usuário");
  } catch (err) {
    console.error("Erro ao excluir:", err);
    alert("Erro de conexão com a API");
  }
}

// =================== Renderização ===================
async function renderizarResultadosAPI() {
  const usuarios = await pegarUsuariosAPI();
  result.innerHTML = "";
  usuarios.forEach(({ id, nome, dias }) => {
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
    iconEditar.onclick = () => abrirTelaEdicao(id);

    const iconExcluir = document.createElement("span");
    iconExcluir.className = "icon excluir";
    iconExcluir.title = "Excluir";
    iconExcluir.innerHTML = "🗑️";
    iconExcluir.onclick = async () => {
      if (confirm(`Excluir ${nome}?`)) {
        await excluirUsuarioAPI(id);
        renderizarResultadosAPI();
      }
    };

    actions.appendChild(iconEditar);
    actions.appendChild(iconExcluir);
    card.appendChild(actions);

    result.appendChild(card);
  });
}

// =================== Edição ===================
async function abrirTelaEdicao(id) {
  const usuarios = await pegarUsuariosAPI();
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return alert("Usuário não encontrado.");

  indiceEditando = id;
  titulo.textContent = "Editar Usuário";
  const editInput = document.getElementById("editNome");
  editInput.value = usuario.nome;
  editInput.classList.add("input-edicao");

  document.querySelectorAll(".dias-edicao .dia").forEach(dia => {
    dia.classList.remove("active");
    if (usuario.dias.includes(dia.textContent)) dia.classList.add("active");
  });

  document.getElementById("telaPrincipal").style.display = "none";
  document.getElementById("telaEdicao").style.display = "block";
}

function fecharTelaEdicao() {
  titulo.textContent = "Trabalho Presencial";
  document.getElementById("editNome").classList.remove("input-edicao");
  document.getElementById("telaPrincipal").style.display = "block";
  document.getElementById("telaEdicao").style.display = "none";
  indiceEditando = null;
}

// =================== Botões ===================
document.getElementById("salvarEdicao").addEventListener("click", async () => {
  const novoNome = document.getElementById("editNome").value.trim();
  const novosDias = [...document.querySelectorAll(".dias-edicao .dia.active")]
    .map(d => d.textContent);
  if (!novoNome || novosDias.length === 0) return alert("Preencha o nome e selecione pelo menos um dia.");
  await atualizarUsuarioAPI(indiceEditando, novoNome, novosDias);
  fecharTelaEdicao();
  renderizarResultadosAPI();
});

document.getElementById("cancelarEdicao").addEventListener("click", fecharTelaEdicao);
registrar.addEventListener("click", registrarUsuario);
window.addEventListener("DOMContentLoaded", renderizarResultadosAPI);
