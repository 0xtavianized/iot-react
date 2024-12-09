import { useRoutes } from "react-router";
import App from "./App.tsx";
import History from "./history.tsx";

export default function Route() {
  let element = useRoutes([
    {
      path: "/",
      element: <App />,
    },
    { path: "history", element: <History /> },
  ]);

  return element;
}
