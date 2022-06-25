import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Prefences from "./Components/Preferences/Preferences";
import Layout from "./Components/Layout/Layout";
import NoPage from "./Components/NoPage/NoPage";
import Login from "./Components/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./Components/AuthProvider/AuthProvider";
import { useEffect, useState } from "react";

var userLang = navigator.language || navigator.userLanguage;

function App() {
  const [title, setTitle] = useState("");
  useEffect(() => {
    const appTitle = userLang === "es-ES" ? "Contador Pro" : "Pro Counter";
    setTitle(appTitle);
    document.title = appTitle;
  });
  return (
    <AuthProvider>
      <div className="container mx-auto my-0 py-2 text-center text-stone-800 bg-stone-200 min-h-screen">
        <h1 className="text-3xl font-bold m-3">{}</h1>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="preferences"
              element={
                <ProtectedRoute>
                  <Prefences />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
        <footer className="text-xs mt-12">
          {userLang === "es-ES" ? "Escrito por " : "Coded by "}
          <a
            className="text-sky-700 hover:underline hover:decoration-solid transition-all"
            href="https://adrianburgoscolas.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Adrian Burgos
          </a>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
