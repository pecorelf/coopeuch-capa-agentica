import React from "react";
import { MARCA as M } from "../datos/marca";

/* Límite de error.
   Sin esto, cualquier excepción durante el render deja la pantalla en blanco y
   no queda rastro de qué falló. En una demostración frente a un cliente eso es
   lo peor que puede pasar: mejor un mensaje claro y un botón para volver. */

interface Estado {
  error: Error | null;
  info: string;
}

export class LimiteDeError extends React.Component<{ children: React.ReactNode }, Estado> {
  state: Estado = { error: null, info: "" };

  static getDerivedStateFromError(error: Error): Partial<Estado> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Queda en la consola del navegador para poder diagnosticarlo.
    console.error("Error de render:", error, info.componentStack);
    this.setState({ info: String(info.componentStack || "").split("\n").slice(0, 6).join("\n") });
  }

  reiniciar = () => {
    this.setState({ error: null, info: "" });
  };

  limpiarSesion = () => {
    try {
      window.localStorage.removeItem("cam.institucion");
    } catch {}
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ minHeight: "100vh", background: M.niebla, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 16, padding: 28, maxWidth: 680, width: "100%" }}>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: ".12em", color: M.falla }}>ERROR DE RENDER</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>Algo falló al dibujar esta vista</div>
          <div style={{ fontSize: 13, color: M.gris, lineHeight: 1.65, marginTop: 10 }}>
            La demostración sigue funcionando. Puede volver atrás o reiniciar la institución activa si el problema se
            repite al cambiar de cliente.
          </div>

          <pre className="font-mono" style={{ fontSize: 11, lineHeight: 1.6, background: M.niebla, padding: 12, borderRadius: 10, marginTop: 16, overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.message || this.state.error)}
            {this.state.info ? "\n\n" + this.state.info : ""}
          </pre>

          <div className="flex gap-2 flex-wrap" style={{ marginTop: 18 }}>
            <button onClick={this.reiniciar}
              style={{ fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 999, border: "1px solid", background: M.rojo, color: "#fff", borderColor: M.rojo, cursor: "pointer" }}>
              Volver a intentar
            </button>
            <button onClick={this.limpiarSesion}
              style={{ fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 999, border: `1px solid ${M.linea}`, background: "#fff", color: M.tinta, cursor: "pointer" }}>
              Reiniciar institución y recargar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
