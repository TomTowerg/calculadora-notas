import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Ramos from "./components/Ramos";
import Resumen from "./components/Resumen";
import Perfil from "./components/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Ramos },
      { path: "resumen", Component: Resumen },
      { path: "perfil", Component: Perfil },
    ],
  },
]);
