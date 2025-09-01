// --- Alternar seções ---
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-section");
    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === target) sec.classList.add("active");
    });
  });
});

// --- Buscar Pokémon ---
async function buscarPokemon(valor) {
  const destino = document.getElementById("pokemon-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID.</p>";
    return;
  }

  // decide se é número (id) ou texto (nome)
  const endpoint = isNaN(valor)
    ? `http://localhost:3000/pokemon/name/${valor.toLowerCase()}`
    : `http://localhost:3000/pokemon/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    // Render Pokémon
    destino.innerHTML = `
      <div class="pokemon-card">
        <h2>#${data.id} - ${data.name.english}</h2>
        <img src="${data.image.hires}" alt="${data.name.english}" class="pokemon-img"/>
        <p><b>Tipo:</b> ${data.type.join(", ")}</p>
        <p><b>Espécie:</b> ${data.species}</p>
        <p><b>Descrição:</b> ${data.description}</p>

        <h3>Stats</h3>
        <ul class="stats">
          ${Object.entries(data.base)
            .map(([stat, val]) => `<li>${stat}: ${val}</li>`)
            .join("")}
        </ul>

        <h3>Profile</h3>
        <p><b>Altura:</b> ${data.profile.height}</p>
        <p><b>Peso:</b> ${data.profile.weight}</p>
        <p><b>Gênero:</b> ${data.profile.gender}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

// --- Evento botão "Buscar" Pokémon ---
document.querySelector("#pokemon .buscar").addEventListener("click", () => {
  const valor = document.getElementById("pokemon-input").value.trim();
  buscarPokemon(valor);
});


// --- Buscar Move ---
async function buscarMove(valor) {
  const destino = document.getElementById("moves-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID do move.</p>";
    return;
  }

  const endpoint = isNaN(valor)
    ? `http://localhost:3000/move/name/${valor.toLowerCase()}`
    : `http://localhost:3000/move/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    // Render Move
    destino.innerHTML = `
      <div class="move-card">
        <h2>#${data.id} - ${data.ename}</h2>
        <p><b>Japonês:</b> ${data.jname}</p>
        <p><b>Chinês:</b> ${data.cname}</p>
        <p><b>Categoria:</b> ${data.category}</p>
        <p><b>Tipo:</b> ${data.type}</p>
        <p><b>Poder:</b> ${data.power ?? "—"}</p>
        <p><b>PP:</b> ${data.pp}</p>
        <p><b>Precisão:</b> ${data.accuracy ?? "—"}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

// --- Evento botão "Buscar" Move ---
document.querySelector("#moves .buscar").addEventListener("click", () => {
  const valor = document.getElementById("moves-input").value.trim();
  buscarMove(valor);
});

// --- Buscar Item ---
async function buscarItem(valor) {
  const destino = document.getElementById("item-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID do item.</p>";
    return;
  }

  const endpoint = isNaN(valor)
    ? `http://localhost:3000/item/name/${valor.toLowerCase()}`
    : `http://localhost:3000/item/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    // Render Item
    destino.innerHTML = `
      <div class="item-card">
        <h2>#${data.id} - ${data.name.english}</h2>
        <p><b>Japonês:</b> ${data.name.japanese}</p>
        <p><b>Chinês:</b> ${data.name.chinese}</p>
        <p><b>Tipo:</b> ${data.type}</p>
        <p><b>Descrição:</b> ${data.description}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

// --- Evento botão "Buscar" Item ---
document.querySelector("#item .buscar").addEventListener("click", () => {
  const valor = document.getElementById("item-input").value.trim();
  buscarItem(valor);
});


// --- Buscar Type ---
async function buscarType(valor) {
  const destino = document.getElementById("type-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um tipo de Pokémon.</p>";
    return;
  }

  const endpoint = `http://localhost:3000/type/${valor.toLowerCase()}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    // Render Type
    destino.innerHTML = `
      <div class="type-card">
        <h2>${data.english}</h2>
        <p><b>Japonês:</b> ${data.japanese}</p>
        <p><b>Chinês:</b> ${data.chinese}</p>

        <h3>✔️ Eficaz contra</h3>
        <p>${data.effective.join(", ") || "—"}</p>

        <h3>⚠️ Ineficaz contra</h3>
        <p>${data.ineffective.join(", ") || "—"}</p>

        <h3>❌ Sem efeito em</h3>
        <p>${data.no_effect.join(", ") || "—"}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

// --- Evento botão "Buscar" Type ---
document.querySelector("#type .buscar").addEventListener("click", () => {
  const valor = document.getElementById("type-input").value.trim();
  buscarType(valor);
});
