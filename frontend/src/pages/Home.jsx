import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

export default function Home() {
  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column", backgroundColor: "#2563eb", padding:"0 0 5rem 0" }}>
      {/* Navbar */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 3rem",
        backgroundColor: "#2563eb",
        color: "white",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <img src="/img/icon branco png.png" alt="MedQueue Logo" style={{ height: "40px" }} />
        </div>

        {/* Login */}
        <Button
          variant="contained"
          startIcon={<LoginIcon />}
          sx={{
            backgroundColor: "white",
            color: "#2563eb",
            fontWeight: "bold",
            borderRadius: "20px",
            padding: "0.5rem 1.5rem",
            textTransform: "none"
          }}
        >
          Login
        </Button>
      </header>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 4rem" }}>
        {/* Texto à esquerda */}
        <div style={{ color: "white", maxWidth: "50%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h1 style={{ fontSize: "2.75rem", fontWeight: "bold", lineHeight: "1.2" }}>
          Organize com eficiência. <br />Atenda com agilidade.
          </h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#2563eb",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "0.5rem 1.5rem",
                textTransform: "none"
              }}
            >
              Entrar em Fila
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: "20px",
                padding: "0.5rem 1.5rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#2563eb",
                },
              }}
            >
              Saiba mais
            </Button>
          </div>
        </div>

        {/* Imagem à direita */}
        <div style={{ maxWidth: "45%" }}>
          <img
            src="/img/main-home.png"
            alt="Pessoa interagindo com cards"
            style={{ width: "100%", maxHeight: "450px", objectFit: "contain" }}
          />
        </div>
      </main>

      {/* Onda decorativa inferior */}
      {/* <div style={{ width: "100%", height: "60px", background: "white", borderTopLeftRadius: "100% 50%", borderTopRightRadius: "100% 50%" }} /> */}
    </div>
  );
}
