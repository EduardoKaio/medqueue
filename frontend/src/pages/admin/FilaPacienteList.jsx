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
  Grid,
  Divider,
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

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchPacientes, 30000);
    return () => clearInterval(interval);
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

  // Separar pacientes em duas categorias
  const otherPatients = pacientes.filter((p) => p.checkIn || p.atendido);
  const inQueuePatients = pacientes.filter((p) => !p.checkIn && !p.atendido);

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
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
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
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : pacientes.length === 0 ? (
            <Paper
              elevation={2}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Typography variant="h6">Nenhum paciente nesta fila.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {/* Tabela da esquerda - Pacientes com check-in e atendidos */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Em atendimento/Atendidos
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      overflow: "auto",
                      minHeight: "400px",
                      maxHeight: "600px",
                    }}
                  >
                    {otherPatients.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          p: 3,
                        }}
                      >
                        <Typography sx={{ color: "text.secondary" }}>
                          Nenhum paciente em atendimento ou atendido.
                        </Typography>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {otherPatients.map((paciente, index) => (
                          <React.Fragment key={paciente.pacienteId}>
                            <ListItem
                              sx={{
                                py: 2,
                                px: 3,
                                backgroundColor: paciente.atendido
                                  ? "#e8f5e9"
                                  : "#e3f2fd",
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                  >
                                    #{index + 1} - {paciente.nomePaciente}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: paciente.atendido
                                        ? "success.main"
                                        : "info.main",
                                      mt: 0.5,
                                    }}
                                  >
                                    {paciente.atendido
                                      ? "Atendido"
                                      : "Aguardando atendimento"}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Tabela da direita - Pacientes na fila */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#ff9800",
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Na fila
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      overflow: "auto",
                      minHeight: "400px",
                      maxHeight: "600px",
                    }}
                  >
                    {inQueuePatients.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          p: 3,
                        }}
                      >
                        <Typography sx={{ color: "text.secondary" }}>
                          Nenhum paciente na fila.
                        </Typography>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {inQueuePatients.map((paciente, index) => (
                          <React.Fragment key={paciente.pacienteId}>
                            <ListItem
                              sx={{
                                py: 2,
                                px: 3,
                                backgroundColor: "#fff3e0",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                              }}
                            >
                              <Box
                                sx={{
                                  flex: 1,
                                  mr: { xs: 0, sm: 2 },
                                  mb: { xs: 2, sm: 0 },
                                }}
                              >
                                <Typography variant="body1" fontWeight="medium">
                                  #{index + 1} - {paciente.nomePaciente}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "warning.main", mt: 0.5 }}
                                >
                                  Na fila
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() =>
                                  handleCheckIn(paciente.pacienteId)
                                }
                                sx={{ minWidth: 120 }}
                              >
                                Fazer check-in
                              </Button>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
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
