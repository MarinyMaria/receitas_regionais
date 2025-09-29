// --- Elementos ---
const secUsuarios = document.getElementById("secUsuarios");
const secReceitas = document.getElementById("secReceitas");
const btnUsuarios = document.getElementById("btnUsuarios");
const btnReceitas = document.getElementById("btnReceitas");

// --- Navegação ---
btnUsuarios.addEventListener("click", () => mostrarSecao("usuarios"));
btnReceitas.addEventListener("click", () => mostrarSecao("receitas"));

function mostrarSecao(sec) {
  secUsuarios.classList.toggle("hidden", sec !== "usuarios");
  secReceitas.classList.toggle("hidden", sec !== "receitas");
}

// --- Usuários ---
const formUsuario = document.getElementById("formUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function atualizarUsuarios() {
  listaUsuarios.innerHTML = "";
  usuarios.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.nome} (${u.email})`;
    listaUsuarios.appendChild(li);
  });
}

formUsuario.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nomeUsuario").value;
  const email = document.getElementById("emailUsuario").value;
  const senha = document.getElementById("senhaUsuario").value;
  usuarios.push({ nome, email, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  formUsuario.reset();
  atualizarUsuarios();
});
atualizarUsuarios();

// --- Receitas ---
const formReceita = document.getElementById("formReceita");
const listaReceitas = document.getElementById("listaReceitas");
let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
let editIndex = null;

function atualizarReceitas() {
  listaReceitas.innerHTML = "";
  receitas.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "receita";
    div.innerHTML = `
      <h4>${r.titulo}</h4>
      <strong>Ingredientes:</strong>
      <ul>${r.ingredientes.map(item => `<li>${item}</li>`).join("")}</ul>
      <strong>Modo de Preparo:</strong>
      <ol>${r.preparo.map(p => `<li>${p}</li>`).join("")}</ol>
      <p><strong>Tags:</strong> ${r.tags}</p>
      <button class="editar" data-id="${i}">Editar</button>
      <button class="excluir" data-id="${i}">Excluir</button>
    `;
    listaReceitas.appendChild(div);
  });
}

formReceita.addEventListener("submit", e => {
  e.preventDefault();
  const titulo = document.getElementById("tituloReceita").value;
  const ingredientes = document.getElementById("ingredientes").value.split("\n");
  const preparo = document.getElementById("preparo").value.split("\n");
  const tags = document.getElementById("tags").value;

  if (editIndex !== null) {
    receitas[editIndex] = { titulo, ingredientes, preparo, tags };
    editIndex = null;
  } else {
    receitas.push({ titulo, ingredientes, preparo, tags });
  }

  localStorage.setItem("receitas", JSON.stringify(receitas));
  formReceita.reset();
  atualizarReceitas();
});

// Editar / Excluir
listaReceitas.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("editar")) {
    const r = receitas[id];
    document.getElementById("tituloReceita").value = r.titulo;
    document.getElementById("ingredientes").value = r.ingredientes.join("\n");
    document.getElementById("preparo").value = r.preparo.join("\n");
    document.getElementById("tags").value = r.tags;
    editIndex = id;
    mostrarSecao("receitas");
  }
  if (e.target.classList.contains("excluir")) {
    receitas.splice(id, 1);
    localStorage.setItem("receitas", JSON.stringify(receitas));
    atualizarReceitas();
  }
});

atualizarReceitas();
