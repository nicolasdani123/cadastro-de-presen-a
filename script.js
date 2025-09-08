const form = document.getElementById("form");
const lista = document.getElementById("lista");
const key = "pessoas";
let registrosArray = [];
let editIndex = null;

window.onload = () => {
  const stored = localStorage.getItem(key);
  if (stored) {
    registrosArray = JSON.parse(stored);
    renderizar();
  }
};

function createRegistro() {
  const registro = {
    nome: document.getElementById("nome").value.trim(),
    dia1: document.getElementById("dia1").value,
    dia2: document.getElementById("dia2").value
  };

  const jaExiste = registrosArray.some((item, i) => {
    if (editIndex !== null && i === editIndex) return false;
    return item.nome === registro.nome && item.dia1 === registro.dia1 && item.dia2 === registro.dia2;
  });

  if (jaExiste) {
    alert("Este registro já existe!");
    return;
  }

  if (editIndex === null) {
    registrosArray.push(registro);
  } else {
    registrosArray[editIndex] = registro;
    editIndex = null;
  }

  saveLocalStorage();
  form.reset();
  renderizar();
}

function renderizar() {
  lista.innerHTML = "";
  registrosArray.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <span><b>${item.nome}</b> → ${item.dia1} e ${item.dia2}</span>
      <div class="acoes">
        <button onclick="editar(${index})">Editar</button>
        <button onclick="excluir(${index})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function saveLocalStorage() {
  localStorage.setItem(key, JSON.stringify(registrosArray));
}

window.editar = function(index) {
  const item = registrosArray[index];
  document.getElementById("nome").value = item.nome;
  document.getElementById("dia1").value = item.dia1;
  document.getElementById("dia2").value = item.dia2;
  editIndex = index;
};

window.excluir = function(index) {
  if (confirm("Deseja realmente excluir este registro?")) {
    registrosArray.splice(index, 1);
    saveLocalStorage();
    renderizar();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createRegistro();
});
