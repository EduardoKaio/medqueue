import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TimerIcon from "@mui/icons-material/Timer";
import { motion, useAnimation } from "framer-motion";
import AnimatedSection from "../components/AnimationSection";

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <header id="topo" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem 3rem 1rem 3rem",
        backgroundColor: "#0079CD",
        color: "white",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/img/icon branco png.png" alt="MedQueue Logo" style={{ height: "40px" }} />
        </div>

        {/* Login */}
        <Link to={`/login`}>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "white",
              color: "#0079CD",
              fontWeight: "bold",
              borderRadius: "1rem", // bem arredondado
              padding: "0.7rem 2rem",
              minWidth: "100px", // largura mínima
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#e0f2ff", // leve azulzinho no hover
                color: "#0079CD",
                transform: "scale(1.05)", // aumenta de tamanho no hover
              },
              "&:active": {
                transform: "scale(0.95)", // dá uma leve "afundada" ao clicar
              },
            }}
          >
            Login
          </Button>
        </Link>
      </header>

      {/* Conteúdo principal */}
      <main 
        style={{ height: "80vh", backgroundColor: "#0079CD", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 4rem"}}>
          {/* Texto à esquerda */}
          <AnimatedSection
            direction="up"
            style={{ color: "white", maxWidth: "50%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h1 style={{ fontSize: "2.75rem", fontWeight: "800", lineHeight: "1.2" }}>
              Organize com eficiência. <br />Atenda com agilidade.
            </h1>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link to={`/filaForm`} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "#0079CD",
                    fontWeight: "bold",
                    borderRadius: "1rem", // bem arredondado
                    padding: "0.75rem 2rem",
                    minWidth: "160px", // largura mínima
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e0f2ff", // leve azulzinho no hover
                      color: "#0079CD",
                      transform: "scale(1.05)", // aumenta de tamanho no hover
                    },
                    "&:active": {
                      transform: "scale(0.95)", // dá uma leve "afundada" ao clicar
                    },
                  }}
                >
                  Entrar em Fila
                </Button>
              </Link>

          <a href="#saibamais" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: "bold",
                borderRadius: "1rem",
                padding: "0.75rem 2rem",
                minWidth: "160px",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#0079CD",
                  borderColor: "white",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              Saiba mais
            </Button>
          </a>
        </div>
        </AnimatedSection>

        {/* Imagem à direita */}
        <AnimatedSection
            direction="up"
        style={{ maxWidth: "45%", }}>
          <img onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            src="/img/main-home.png"
            alt="Pessoa interagindo com cards"
            style={{ width: "100%", maxHeight: "450px", objectFit: "contain",transition: "transform 0.3s ease-in-out",  }}
          />
        </AnimatedSection>
      </main>

      {/* Cards de Benefícios */}
      <section
      style={{ backgroundColor: "#F4F6F9", padding: "5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AnimatedSection direction="up" style={{ 
            fontSize: "3rem", 
            fontWeight: "500", 
            marginBottom: "1.5rem", 
            color: "#333333", 
            textAlign: "center", 
            position: "relative" 
        }}>
          Transforme sua Clínica
          <div style={{
            height: "3px",
            width: "60px",
            backgroundColor: "#0079CD",
            margin: "1rem auto 0",
            borderRadius: "2px"
          }} />
        </AnimatedSection>

        <AnimatedSection direction="up" style={{ 
          color: "#555555", 
          fontSize: "1.2rem", 
          fontWeight: "300", 
          marginBottom: "3rem", 
          maxWidth: "60%", 
          textAlign: "center" 
        }}>
          Organize filas, otimize o fluxo de atendimento e melhore a experiência dos seus pacientes com soluções inteligentes. Tenha o controle completo do seu atendimento.
        </AnimatedSection>

        <AnimatedSection direction="up" style={{ display: "flex", gap: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Card 1 */}
          <div style={cardStyle} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <img src="/img/schedule.png" alt="Organização em Tempo Real" style={cardImageStyle} />
            <h3 style={cardTitleStyle}>Organização em Tempo Real</h3>
            <p style={cardTextStyle}>Gerencie a fila de pacientes ao vivo e otimize o fluxo de atendimento com praticidade e agilidade.</p>
          </div>

          {/* Card 2 */}
          <div style={cardStyle} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <img src="/img/organizing-data.png" alt="Atendimentos Mais Rápidos" style={cardImageStyle} />
            <h3 style={cardTitleStyle}>Atendimentos Mais Rápidos</h3>
            <p style={cardTextStyle}>Reduza o tempo de espera e agilize a organização de prioridades para um atendimento mais eficiente.</p>
          </div>

          {/* Card 3 */}
          <div style={cardStyle} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <img src="/img/medicine.png" alt="Experiência Humanizada" style={cardImageStyle} />
            <h3 style={cardTitleStyle}>Experiência Humanizada</h3>
            <p style={cardTextStyle}>Ofereça uma jornada acolhedora com uma plataforma simples e intuitiva para pacientes e equipes.</p>
          </div>
        </AnimatedSection >
        </section>
      {/* Seção de Métricas */}
      <section id="saibamais" style={{
      backgroundColor: "#F4F6F9",
      padding: "8rem 2rem",
      display: "flex",
      justifyContent: "center",
      
    }}>
      <AnimatedSection onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"} direction="up" style={{
        backgroundColor: "white",
        borderRadius: "2rem",
        padding: "1rem 4rem 3rem 4rem",
        maxWidth: "1000px",
        width: "100%",
        boxShadow: "0px 0px 2px rgba(105, 105, 105, 0.1), 0px 20px 0px #0079CD, 0px 40px 0px #004FA1",
        transition: "transform 0.3s ease-in-out",
      }}>
        {/* título */}
        <h2 style={{
          fontSize: "3rem",
          fontWeight: 700,
          textAlign: "center",
          color: "#4D4D4D",
          marginBottom: "3rem",
          lineHeight: "1",
        }}>
          Revolucionando como clínicas <br />
          <span style={{color:"#0079CD"}}>gerenciam e atendem.</span>
        </h2>
        <p style={{
          textAlign: "center",
          color: "#475569",
          fontSize: "1rem",
          marginBottom: "2.5rem",
          width: "65%",
          margin: "30px auto 100px auto",
        }}>
          Milhares de profissionais de saúde confiam no MedQueue para agilizar atendimentos, reduzir filas e encantar pacientes.
        </p>

        {/* grid de métricas */}
        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2rem",
        textAlign: "center",
      }}>
        {/* Métrica 1 */}
        <div style={{
          display: "flex",
          flexDirection: "column", // Agora em coluna!
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <MedicalServicesIcon sx={{ fontSize: 40, color: "#0079CD" }} />
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#4D4D4D" }}>
            2.150
          </div>
          <div style={{ color: "#333333", fontSize: "0.875rem" }}>
            Clínicas Integradas
          </div>
        </div>

        {/* Métrica 2 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <PeopleIcon sx={{ fontSize: 40, color: "#0079CD" }} />
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#4D4D4D" }}>
            48.762
          </div>
          <div style={{ color: "#333333", fontSize: "0.875rem" }}>
            Atendimentos Processados
          </div>
        </div>

        {/* Métrica 3 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <ThumbUpIcon sx={{ fontSize: 40, color: "#0079CD" }} />
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#4D4D4D" }}>
            93,8%
          </div>
          <div style={{ color: "#475569", fontSize: "0.875rem" }}>
            Satisfação dos Pacientes
          </div>
        </div>

        {/* Métrica 4 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <TimerIcon sx={{ fontSize: 40, color: "#0079CD" }} />
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#4D4D4D" }}>
            35 min
          </div>
          <div style={{ color: "#475569", fontSize: "0.875rem" }}>
            Espera Média Reduzida
          </div>
        </div>
      </div>


      </AnimatedSection>
    </section>
    <footer style={{
      backgroundColor: "#0079CD", // azul bonito
      color: "white",
      fontSize: "1rem", // texto pequeno
      padding: "2rem 6rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <span>© 2025 MedQueue. Todos os direitos reservados.</span>
      <a href="#topo" style={{ textDecoration: "none", color: "white" }}>
        ↑ Voltar ao topo
      </a>
    </footer>

    </div>
  );
}

// Estilos dos cards (para reutilizar e organizar melhor)
const cardStyle = {
  backgroundColor: "white",
  padding: "2.5rem",
  borderRadius: "2rem",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  maxWidth: "350px",
  textAlign: "center",
  transition: "transform 0.3s ease-in-out",
};

const cardImageStyle = {
  width: "100%",
  height: "180px",
  objectFit: "contain",
  marginBottom: "1rem"
};

const cardTitleStyle = {
  color: "#333333",
  fontSize: "1.3rem",
  fontWeight: "bold",
  marginBottom: "0.5rem"
};

const cardTextStyle = {
  color: "#777777",
  textAlign: "justify",
  fontWeight: "300"
};
