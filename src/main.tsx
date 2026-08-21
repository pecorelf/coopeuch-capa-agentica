import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LimiteDeError } from "./componentes/LimiteDeError";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <LimiteDeError>
    <App />
  </LimiteDeError>
);
