// src/app/auth/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/AuthService";
import "./auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    document.title = 'To-Do | Login';
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
        console.log("Inicio de sesión exitoso");
        router.push("/");
      } else {
        await register(nombre, email, password);
        console.log("Registro exitoso");
        router.push("/auth");
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        isLogin
          ? "Error al iniciar sesión. Por favor, intente de nuevo."
          : "Error al registrarse. Por favor, intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-container">
          <h1>To-Do App</h1>
        </div>
        <div className="auth-form-container">
          <h3 className="auth-title">
            {isLogin ? "Inicia sesión para continuar" : "Registrarse"}
          </h3>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
            {!isLogin && (
              <div className="auth-input-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="auth-input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
            </div>
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </form>
          <div className="auth-footer">
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <button className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
