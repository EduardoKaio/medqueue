import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,

} from "@mui/material";
import { getPacientesCount } from "../../services/GerenciamentoPacienteService";
import { getFilasAtivasCount } from "../../services/FilaService";
import TotalPacientes from "../../components/dashboard/TotalPacientes";
import {getTempoMedioEspera, getTamanhoMedioFilas} from "../../services/InsigthsAdmin";
import FilasAtivas from "../../components/dashboard/FilasAtivas";
import TempoMedioEspera from "../../components/dashboard/TempoMedioEspera";
import TamanhoMedioFilas from "../../components/dashboard/TamanhoMedioFilas";
import GraficoEsperaPorSetor from "../../components/dashboard/GraficoEsperaPorSetor";
import GraficoPizzaDistPacienteSetor from "../../components/dashboard/GraficoPizzaDistPacienteSetor";

const COLORS = ["#1976d2", "#26a69a", "#f44336", "#ffb300"];


function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [insights, setInsights] = useState({ today: 0, month: 0 });

  useEffect(() => {
    getPacientesCount()
      .then((res) => {
        setPatientCount(res.data.count);
      })
      .catch((err) => {
        console.error("Erro ao buscar contagem de pacientes", err);
      });
      getFilasAtivasCount()
      .then((res) => {
        setQueueCount(res.data.count);
      })
      .catch((err) => {
        console.error("Erro ao buscar contagem de filas", err);
      });

    setInsights({ today: 5, month: 120 });
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 8 }}
      >
        <Header
          open={open}
          drawerWidth={drawerWidth}
          drawerWidthClosed={drawerWidthClosed}
          title="Administração da Clínica"
        />
        <Container maxWidth="xl">
        <Typography

        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
          >
            Dashboard Administrativo
          </Typography>

          {/* Linha 1: Cards informativos com ícones e cores */}
          <Grid container spacing={3} sx={{ mb: 2, width: "100%", alignItems: "stretch" }}>
          <Grid >
              <FilasAtivas
               trend="up"
               diff={14}
               value={queueCount.toLocaleString("pt-BR")}
              />
            </Grid>
            <Grid >
            <TamanhoMedioFilas value={12} />
            </Grid>
            <Grid>
            <TotalPacientes
              trend="up"
              diff={14}
              value={patientCount.toLocaleString("pt-BR")}
            />
            </Grid>
            
            <Grid >
            <TempoMedioEspera
               tempoMedio={30}
              />
            </Grid>
            
          </Grid>

          {/* Linha 2: Gráficos lado a lado ocupando toda a largura */}
          <Grid container spacing={3} sx={{ width: "100%", alignItems: "stretch", mt: 3 }}>
            <Grid>
            <GraficoEsperaPorSetor
              chartSeries={[
                { name: 'Tempo Médio de Espera', data: [22, 34, 18, 41, 26] }
              ]}
              categories={['Pediatria', 'Clínico Geral', 'Ortopedia', 'Oftalmo', 'Cardiologia']}
            />
            </Grid>
            <Grid item xs={12} md={4} sx={{ height: "100%", width: "35%" }}>
            <GraficoPizzaDistPacienteSetor  />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
