import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  
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
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#1976d2", "#26a69a", "#f44336", "#ffb300"];
const adminMenu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon color="primary" /> },
  { label: "Pacientes", path: "/admin/pacientes", icon: <PersonIcon color="primary" /> },
  { label: "Filas", path: "/admin/filas", icon: <PeopleAltIcon color="primary" /> },
];

const dataEspera = [
  { dia: "Seg", tempo: 12 },
  { dia: "Ter", tempo: 15 },
  { dia: "Qua", tempo: 10 },
  { dia: "Qui", tempo: 14 },
  { dia: "Sex", tempo: 9 },
];

const statusPacientes = [
  { name: "Aguardando", value: 40 },
  { name: "Em Atendimento", value: 25 },
  { name: "Finalizado", value: 30 },
  { name: "Faltou", value: 5 },
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

    setQueueCount(8);
    setInsights({ today: 5, month: 120 });
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} menuItems={adminMenu} />
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
            variant="h4"
            sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
        >
            Dashboard Administrativo
        </Typography>

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
            </Grid>
        </Grid>
        </Container>

      </Box>
    </Box>
  );
}

export default Dashboard;
