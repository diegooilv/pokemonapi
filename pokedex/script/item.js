async function buscarItem(valor) {
  const destino = document.getElementById("item-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID do item.</p>";
    return;
  }

  const endpoint = isNaN(valor)
    ? `https://dex.diegooilv.xyz/item/name/${valor.toLowerCase()}`
    : `https://dex.diegooilv.xyz/item/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    destino.innerHTML = `
      <div class="item-card">
        <h2>#${data.id ?? ""} - ${data.name?.english ?? ""}</h2>
        <p><b>Japonês:</b> ${data.name?.japanese ?? ""}</p>
        <p><b>Chinês:</b> ${data.name?.chinese ?? ""}</p>
        <p><b>Tipo:</b> ${data.type ?? ""}</p>
        <p><b>Descrição:</b> ${data.description ?? ""}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

document.querySelector("#item .buscar")?.addEventListener("click", () => {
  const valor = document.getElementById("item-input")?.value.trim();
  buscarItem(valor);
});
