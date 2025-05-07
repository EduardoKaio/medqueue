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
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  listarFilaOrdenada,
  realizarCheckIn,
} from "../../services/FilaPacienteService";

const FilaPacientesList = () => {
  const { id } = useParams();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPacientes();
  }, [id]);

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

  const handleCheckIn = async (pacienteId) => {
    try {
      await realizarCheckIn(id, pacienteId);
      setNotification({
        open: true,
        message: "Check-in realizado com sucesso!",
        severity: "success",
      });
      // Atualiza a lista após o check-in
      fetchPacientes();
    } catch (error) {
      console.error("Erro ao realizar check-in:", error);
      setNotification({
        open: true,
        message: "Erro ao realizar check-in.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          mt: 8,
        }}
      >
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
            <Typography
              variant="h4"
              sx={{ color: "#1976d2", fontWeight: "bold" }}
            >
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
                  <ListItem
                    key={paciente.pacienteId}
                    secondaryAction={
                      !paciente.atendido &&
                      !paciente.checkIn && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleCheckIn(paciente.pacienteId)}
                        >
                          Fazer check-in
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={`#${paciente.posicao} - ${paciente.nomePaciente}`}
                      secondary={
                        paciente.atendido
                          ? "Atendido"
                          : paciente.checkIn
                          ? "Aguardando atendimento"
                          : "Na fila"
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default FilaPacientesList;
