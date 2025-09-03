async function buscarMove(valor) {
  const destino = document.getElementById("moves-conteudo");

  if (!valor) {
    destino.innerHTML = "<p>⚠️ Digite um nome ou ID do move.</p>";
    return;
  }

  const endpoint = isNaN(valor)
    ? `https://dex.diegooilv.xyz/move/name/${valor.toLowerCase()}`
    : `https://dex.diegooilv.xyz/move/id/${valor}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      destino.innerHTML = `<p>❌ ${data.error}</p>`;
      return;
    }

    destino.innerHTML = `
      <div class="move-card">
        <h2>#${data.id ?? ""} - ${data.ename ?? ""}</h2>
        <p><b>Japonês:</b> ${data.jname ?? ""}</p>
        <p><b>Chinês:</b> ${data.cname ?? ""}</p>
        <p><b>Categoria:</b> ${data.category ?? ""}</p>
        <p><b>Tipo:</b> ${data.type ?? ""}</p>
        <p><b>Poder:</b> ${data.power ?? "—"}</p>
        <p><b>PP:</b> ${data.pp ?? ""}</p>
        <p><b>Precisão:</b> ${data.accuracy ?? "—"}</p>
      </div>
    `;
  } catch (err) {
    destino.innerHTML = `<p>❌ Erro na requisição: ${err.message}</p>`;
  }
}

document.querySelector("#moves .buscar")?.addEventListener("click", () => {
  const valor = document.getElementById("moves-input")?.value.trim();
  buscarMove(valor);
});
