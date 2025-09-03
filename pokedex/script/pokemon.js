async function buscarPokemon(valor) {
  const destino = document.getElementById("pokemon-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID.</p>";
    return;
  }

  const endpoint = isNaN(valor)
    ? `https://dex.diegooilv.xyz/pokemon/name/${valor.toLowerCase()}`
    : `https://dex.diegooilv.xyz/pokemon/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    destino.innerHTML = `
      <div class="pokemon-card">
        <h2>#${data.id ?? ""} - ${data.name?.english ?? ""}</h2>
        <img src="${data.image?.hires ?? ""}" alt="${
      data.name?.english ?? ""
    }" class="pokemon-img"/>
        <p><b>Tipo:</b> ${data.type?.join(", ") ?? ""}</p>
        <p><b>Espécie:</b> ${data.species ?? ""}</p>
        <p><b>Descrição:</b> ${data.description ?? ""}</p>

        <h3>Stats</h3>
        <ul class="stats">
          ${
            data.base
              ? Object.entries(data.base)
                  .map(([stat, val]) => `<li>${stat}: ${val}</li>`)
                  .join("")
              : ""
          }
        </ul>

        <h3>Profile</h3>
        <p><b>Altura:</b> ${data.profile?.height ?? ""}</p>
        <p><b>Peso:</b> ${data.profile?.weight ?? ""}</p>
        <p><b>Gênero:</b> ${data.profile?.gender ?? ""}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

document.querySelector("#pokemon .buscar")?.addEventListener("click", () => {
  const valor = document.getElementById("pokemon-input")?.value.trim();
  buscarPokemon(valor);
});
