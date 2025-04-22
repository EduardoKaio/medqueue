import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Sidebar } from "../../components/Sidebar";
import Header from "../../components/Header";
import { drawerWidth, drawerWidthClosed } from "../../components/Sidebar";
import { listarFilaOrdenada } from "../../services/FilaPacienteService";

const FilaPacientesList = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await listarFilaOrdenada(id);
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes da fila:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [id]);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          mt: 8,
        }}
      >
        <Header
          open={open}
          drawerWidth={drawerWidth}
          drawerWidthClosed={drawerWidthClosed}
        />

        <Container>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Link to="/admin/filas">
              <IconButton
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold" }}>
              Pacientes da Fila
            </Typography>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : pacientes.length === 0 ? (
            <Typography>Nenhum paciente nesta fila.</Typography>
          ) : (
            <Paper elevation={3}>
              <List>
                {pacientes.map((paciente) => (
                  <ListItem key={paciente.pacienteId}>
                    <ListItemText
                      primary={`#${paciente.posicao} - ${paciente.nomePaciente}`}
                      secondary={paciente.atendido ? "Atendido" : "Aguardando atendimento"}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default FilaPacientesList;
