import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

const clerkPubKey = "pk_test_cmVndWxhci1oZXJvbi03NS5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkLoading>
        <div className="flex h-screen items-center justify-center">
          <h1 className="font-bold text-3xl">Loading...</h1>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <App />
      </ClerkLoaded>
    </ClerkProvider>
  </React.StrictMode>
);
