import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import App from "./App.tsx";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <AuthKitProvider clientId="client_01KX0GXFVV5KS8B20BEHVATPDS" redirectUri={window.location.origin}>
      <App />
    </AuthKitProvider>
  </ConvexProvider>,
);
