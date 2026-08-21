/* Favicon por institución.
   El .ico de /public era el de Coopeuch y quedaba rojo en la pestaña aunque la
   demostración estuviera configurada para otra marca. Acá se dibuja uno con la
   inicial sobre el color principal de la institución activa, así que siempre
   corresponde. Si el logo es un archivo cargado en la sesión, se usa ese. */

let ultimo = "";

export function aplicarFavicon(opts: { nombre: string; color: string; logo?: string }) {
  if (typeof document === "undefined") return;

  const clave = `${opts.nombre}|${opts.color}|${opts.logo?.slice(0, 40)}`;
  if (clave === ultimo) return;
  ultimo = clave;

  const poner = (href: string) => {
    document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((l) => l.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  };

  /* Un logo cargado en la sesión sirve directo como favicon. */
  if (opts.logo && opts.logo.startsWith("data:image")) return poner(opts.logo);

  try {
    const tam = 64;
    const c = document.createElement("canvas");
    c.width = tam;
    c.height = tam;
    const g = c.getContext("2d");
    if (!g) return;

    /* Cuadrado redondeado del color de marca */
    const r = 14;
    g.fillStyle = opts.color;
    g.beginPath();
    g.moveTo(r, 0);
    g.lineTo(tam - r, 0);
    g.quadraticCurveTo(tam, 0, tam, r);
    g.lineTo(tam, tam - r);
    g.quadraticCurveTo(tam, tam, tam - r, tam);
    g.lineTo(r, tam);
    g.quadraticCurveTo(0, tam, 0, tam - r);
    g.lineTo(0, r);
    g.quadraticCurveTo(0, 0, r, 0);
    g.closePath();
    g.fill();

    /* Inicial de la institución */
    g.fillStyle = "#ffffff";
    g.font = "700 38px Poppins, Inter, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText((opts.nombre || "·").charAt(0).toUpperCase(), tam / 2, tam / 2 + 2);

    poner(c.toDataURL("image/png"));
  } catch {
    /* Si el navegador no deja usar canvas, se queda el favicon del documento. */
  }
}
