import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
<<<<<<< Updated upstream
  Card,
  CardContent,
  
=======

>>>>>>> Stashed changes
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";

import { Sidebar } from "../../components/Sidebar";
import Header from "../../components/Header";
import { drawerWidth, drawerWidthClosed } from "../../components/Sidebar";
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
const adminMenu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon color="primary" /> },
  { label: "Pacientes", path: "/admin/pacientes", icon: <PersonIcon color="primary" /> },
  { label: "Filas", path: "/admin/filas", icon: <PeopleAltIcon color="primary" /> },
];


function Dashboard() {
  const [open, setOpen] = useState(true);
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
      <Sidebar open={open} setOpen={setOpen} menuItems={adminMenu} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 8 }}
      >
<<<<<<< Updated upstream
        <Header
          open={open}
          drawerWidth={drawerWidth}
          drawerWidthClosed={drawerWidthClosed}
          title="Administração da Clínica"
        />
        <Container maxWidth="xl">
        <Typography
=======
        <Container maxWidth="">
          <Typography
>>>>>>> Stashed changes
            variant="h4"
            sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
        >
            Dashboard Administrativo
        </Typography>

<<<<<<< Updated upstream
        {/* Linha 1: Cards informativos */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: 160 }}>
                <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Pacientes
                </Typography>
                <Typography variant="h4">{patientCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Total cadastrados
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: 160 }}>
                <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Filas Ativas
                </Typography>
                <Typography variant="h4">{queueCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Hoje no sistema
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: 160 }}>
                <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Atendimentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Hoje: {insights.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    No mês: {insights.month}
                </Typography>
                </CardContent>
            </Card>
            </Grid>
        </Grid>

        {/* Linha 2: Gráficos */}
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
            <Card sx={{ minHeight: 320 }}>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                    Tempo Médio de Espera (min)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dataEspera}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tempo" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
            </Grid>

            <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 320 }}>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                    Status dos Pacientes
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                    <Pie
                        data={statusPacientes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                    >
                        {statusPacientes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
=======
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
>>>>>>> Stashed changes
            </Grid>
        </Grid>
        </Container>

      </Box>
    </Box>
  );
}

export default Dashboard;
