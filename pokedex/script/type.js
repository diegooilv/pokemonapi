async function buscarType(valor) {
  const destino = document.getElementById("type-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um tipo de Pokémon.</p>";
    return;
  }

  const endpoint = `https://dex.diegooilv.xyz/type/${valor.toLowerCase()}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    destino.innerHTML = `
      <div class="type-card">
        <h2>${data.english ?? ""}</h2>
        <p><b>Japonês:</b> ${data.japanese ?? ""}</p>
        <p><b>Chinês:</b> ${data.chinese ?? ""}</p>

        <h3>✔️ Eficaz contra</h3>
        <p>${data.effective?.join(", ") || "—"}</p>

        <h3>⚠️ Ineficaz contra</h3>
        <p>${data.ineffective?.join(", ") || "—"}</p>

        <h3>❌ Sem efeito em</h3>
        <p>${data.no_effect?.join(", ") || "—"}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

document.querySelector("#type .buscar")?.addEventListener("click", () => {
  const valor = document.getElementById("type-input")?.value.trim();
  buscarType(valor);
});
