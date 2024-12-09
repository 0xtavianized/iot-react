import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Route from "./routes.tsx";

const root = document.getElementById("root");

createRoot(root!).render(
  <BrowserRouter>
    <Route />
  </BrowserRouter>
);
