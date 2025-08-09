import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";  
import {HeroUIProvider} from '@heroui/react'
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
    </React.StrictMode>
  </AuthProvider>
)
