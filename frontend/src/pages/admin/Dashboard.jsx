import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getPacientesCount } from "../../services/GerenciamentoPacienteService";
import { getFilasAtivasCount } from "../../services/FilaService";
import TotalPacientes from "../../components/dashboard/TotalPacientes";
import { getTempoMedioEspera, getTamanhoMedioFila } from "../../services/InsigthsAdmin";
import FilasAtivas from "../../components/dashboard/FilasAtivas";
import TempoMedioEspera from "../../components/dashboard/TempoMedioEspera";
import TamanhoMedioFilas from "../../components/dashboard/TamanhoMedioFilas";
import GraficoEsperaPorSetor from "../../components/dashboard/GraficoEsperaPorSetor";
import GraficoPizzaDistPacienteSetor from "../../components/dashboard/GraficoPizzaDistPacienteSetor";

const COLORS = ["#1976d2", "#26a69a", "#f44336", "#ffb300"];


function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [tempoMedioEspera, setTempoMedioEspera] = useState(0);
  const [tamanhoMedioFilas, setTamanhoMedioFilas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPacientesCount()
        .then((res) => setPatientCount(res.data.count))
        .catch((err) => console.error("Erro ao buscar contagem de pacientes", err)),
      getFilasAtivasCount()
        .then((res) => setQueueCount(res.data.count))
        .catch((err) => console.error("Erro ao buscar contagem de filas", err)),
      getTempoMedioEspera()
        .then((res) => setTempoMedioEspera(res.data.tempoMedioEsperaFilas || 0))
        .catch((err) => console.error("Erro ao buscar tempo médio de espera", err)),
      getTamanhoMedioFila()
        .then((res) => setTamanhoMedioFilas(res.data.tamanhoMedioFilas))
        .catch((err) => console.error("Erro ao buscar tamanho médio das filas", err)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={80} />
        <Typography
          variant="h6"
          sx={{ mt: 2, color: "#1976d2" }}
        >
          Carregando dados...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 8 }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
          >
            Dashboard Administrativo
          </Typography>

          {/* Linha 1: Cards informativos com ícones e cores */}
          <Grid container spacing={3} sx={{ mb: 2, width: "100%", alignItems: "stretch" }}>
            <Grid item xs={12} sm={6} md={3}>
              <FilasAtivas
                trend="up"
                diff={14}
                value={queueCount.toLocaleString("pt-BR")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TamanhoMedioFilas value={tamanhoMedioFilas} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TotalPacientes
                trend="up"
                diff={14}
                value={patientCount.toLocaleString("pt-BR")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TempoMedioEspera tempoMedio={tempoMedioEspera} />
            </Grid>
          </Grid>

          {/* Linha 2: Gráficos lado a lado ocupando toda a largura */}
          <Grid container spacing={3} sx={{ width: "100%", alignItems: "stretch", mt: 3 }}>
            <Grid item xs={12} md={8}>
              <GraficoEsperaPorSetor
                chartSeries={[
                  { name: "Tempo Médio de Espera", data: [22, 34, 18, 41, 26] },
                ]}
                categories={[
                  "Pediatria",
                  "Clínico Geral",
                  "Ortopedia",
                  "Oftalmo",
                  "Cardiologia",
                ]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <GraficoPizzaDistPacienteSetor />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
