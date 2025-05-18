import React, { useEffect, useState, useCallback } from "react";
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
  TextField,
  Tooltip,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  HowToReg as HowToRegIcon,
} from "@mui/icons-material";
import {
  listarFilaOrdenada,
  realizarCheckIn,
  marcarComoAtrasado,
} from "../../services/FilaPacienteService";
import { buscarFilaPorId } from "../../services/FilaService";

const FilaPacientesList = () => {
  const { id } = useParams();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [delayedPatients, setDelayedPatients] = useState([]);
  const [firstPatientId, setFirstPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filaDetalhes, setFilaDetalhes] = useState(null);
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);

  const fetchFilaDetalhes = useCallback(async () => {
    try {
      const response = await buscarFilaPorId(id);
      setFilaDetalhes(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da fila:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPacientes();
    fetchFilaDetalhes();

    const interval = setInterval(fetchPacientes, 30000);
    return () => clearInterval(interval);
  }, [id, fetchFilaDetalhes]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeUpdateTrigger((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await listarFilaOrdenada(id);
      setPacientes(response.data);

      const inQueuePatients = response.data.filter(
        (p) =>
          !p.checkIn &&
          p.status === "Na fila" &&
          !delayedPatients.includes(p.pacienteId)
      );

      const atrasadosDoBackend = response.data
        .filter((p) => p.status === "Atrasado")
        .map((p) => p.pacienteId);

      if (atrasadosDoBackend.length > 0) {
        setDelayedPatients((prev) => {
          const novaLista = [...prev];
          atrasadosDoBackend.forEach((id) => {
            if (!novaLista.includes(id)) {
              novaLista.push(id);
            }
          });
          return novaLista;
        });
      }

      if (inQueuePatients.length > 0) {
        const firstPatient = inQueuePatients[0];

        if (firstPatientId !== firstPatient.pacienteId) {
          setFirstPatientId(firstPatient.pacienteId);
          // Não definimos firstInQueueTimestamp aqui, usaremos a dataEntrada do paciente
        }
      } else {
        setFirstPatientId(null);
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes da fila:", error);
    } finally {
      setLoading(false);
    }
  }, [id, delayedPatients, firstPatientId]);

  useEffect(() => {
    fetchPacientes();

    const interval = setInterval(fetchPacientes, 30000);
    return () => clearInterval(interval);
  }, [id, fetchPacientes]);

  useEffect(() => {
    if (firstPatientId && filaDetalhes && filaDetalhes.tempoMedio) {
      const tempoLimiteMs = filaDetalhes.tempoMedio * 60 * 1000;

      const verificarTimeout = () => {
        const firstPatient = pacientes.find(
          (p) => p.pacienteId === firstPatientId
        );

        if (!firstPatient || !firstPatient.dataEntrada) {
          return;
        }

        const dataEntrada = new Date(firstPatient.dataEntrada);
        const agora = new Date();
        const tempoDecorridoMs = agora - dataEntrada;

        if (tempoDecorridoMs >= tempoLimiteMs) {
          setDelayedPatients((prev) => [...prev, firstPatientId]);

          marcarComoAtrasado(id, firstPatientId)
            .then(() => {
              fetchPacientes();

              setNotification({
                open: true,
                message: "Paciente removido da fila por atraso!",
                severity: "warning",
              });
            })
            .catch((error) => {
              console.error("Erro ao marcar paciente como atrasado:", error);
            });

          setFirstPatientId(null);
        }
      };

      const intervalo = setInterval(verificarTimeout, 1000);
      return () => clearInterval(intervalo);
    }
  }, [firstPatientId, filaDetalhes, pacientes, id, fetchPacientes]);

  const handleCheckIn = async (pacienteId) => {
    try {
      await realizarCheckIn(id, pacienteId);
      if (pacienteId === firstPatientId) {
        setFirstPatientId(null);
      }
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

  const otherPatients = pacientes.filter(
    (p) => p.checkIn || p.status === "Atendido"
  );
  const inQueuePatients = pacientes.filter(
    (p) => !p.checkIn && p.status === "Na fila"
  );
  const timeoutPatients = pacientes.filter(
    (p) => p.status === "Atrasado" || delayedPatients.includes(p.pacienteId)
  );

  const calcularTempoEsperado = (index, pacienteId) => {
    if (!filaDetalhes || filaDetalhes.tempoMedio === undefined) {
      return "Calculando...";
    }

    const paciente = pacientes.find((p) => p.pacienteId === pacienteId);
    if (!paciente || !paciente.dataEntrada) {
      return "Calculando...";
    }

    const tempoTotalEstimadoMinutos = filaDetalhes.tempoMedio * (index + 1);

    const dataEntrada = new Date(paciente.dataEntrada);
    const agora = new Date();
    const tempoDecorridoMs = agora - dataEntrada;
    const tempoDecorridoMinutos = tempoDecorridoMs / (1000 * 60);

    const tempoRestanteMinutos = Math.max(
      0,
      tempoTotalEstimadoMinutos - tempoDecorridoMinutos
    );

    if (tempoRestanteMinutos === 0) {
      return "Atendimento a qualquer momento";
    } else if (tempoRestanteMinutos < 1) {
      return "Menos de 1 minuto";
    } else if (tempoRestanteMinutos < 60) {
      return `${Math.round(tempoRestanteMinutos)} min`;
    } else {
      const horas = Math.floor(tempoRestanteMinutos / 60);
      const minutos = Math.round(tempoRestanteMinutos % 60);
      return `${horas}h ${minutos > 0 ? minutos + "min" : ""}`;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          p: 3,
          mt: 8,
          width: "100%",
        }}
      >
        <Container maxWidth="false">
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
            <Grid container spacing={4} sx={{ flexWrap: "nowrap" }}>
              <Grid item xs={12} md={4} sx={{ display: "flex", width: "30%" }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    height: "40rem",
                    overflow: "hidden",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
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
                      minHeight: "450px",
                      maxHeight: "650px",
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
                                backgroundColor:
                                  paciente.status === "Atendido"
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
                                      color:
                                        paciente.status === "Atendido"
                                          ? "success.main"
                                          : "info.main",
                                      mt: 0.5,
                                    }}
                                  >
                                    {paciente.status === "Atendido"
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
              <Grid item xs={12} md={4} sx={{ display: "flex", width: "30%" }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    height: "40rem",
                    overflow: "hidden",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
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
                      minHeight: "450px",
                      maxHeight: "650px",
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
                                backgroundColor: () => {
                                  if (index !== 0) return "#fff3e0";
                                  if (
                                    !filaDetalhes ||
                                    !filaDetalhes.tempoMedio ||
                                    !paciente.dataEntrada
                                  )
                                    return "#fff3e0";
                                  const dataEntrada = new Date(
                                    paciente.dataEntrada
                                  );
                                  const agora = new Date();
                                  const tempoDecorridoMs = agora - dataEntrada;
                                  const limiteAlerta =
                                    filaDetalhes.tempoMedio * 60 * 1000 * 0.8;
                                  return tempoDecorridoMs > limiteAlerta
                                    ? "#ffe0e0"
                                    : "#fff3e0";
                                },
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: {
                                  xs: "flex-start",
                                  sm: "center",
                                },
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
                                <Typography variant="body1" fontWeight="medium">
                                  Prioridade: {paciente.prioridade}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color:
                                      index === 0 &&
                                      firstPatientId &&
                                      Date.now() -
                                        new Date(
                                          pacientes.find(
                                            (p) =>
                                              p.pacienteId === firstPatientId
                                          ).dataEntrada
                                        ) >
                                        240000
                                        ? "error.main"
                                        : "warning.main",
                                    mt: 0.5,
                                  }}
                                >
                                  {index === 0 &&
                                  filaDetalhes &&
                                  filaDetalhes.tempoMedio
                                    ? firstPatientId &&
                                      Date.now() -
                                        new Date(
                                          pacientes.find(
                                            (p) =>
                                              p.pacienteId === firstPatientId
                                          ).dataEntrada
                                        ) >
                                        filaDetalhes.tempoMedio *
                                          60 *
                                          1000 *
                                          0.8
                                      ? "Prestes a ser removido!"
                                      : "Primeiro da fila"
                                    : "Na fila"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    color: "text.secondary",
                                    mt: 0.5,
                                  }}
                                >
                                  Tempo estimado de espera:{" "}
                                  {calcularTempoEsperado(
                                    index,
                                    paciente.pacienteId
                                  )}
                                </Typography>
                              </Box>
                              <Tooltip
                                title="Fazer check-in"
                                arrow
                                placement="top"
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleCheckIn(paciente.pacienteId)
                                  }
                                  sx={{
                                    minWidth: "auto",
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    padding: 0,
                                  }}
                                >
                                  <HowToRegIcon />
                                </Button>
                              </Tooltip>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", width: "30%" }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    height: "40rem",
                    overflow: "hidden",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#d32f2f",
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Atrasados/Removidos da fila
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      overflow: "auto",
                      minHeight: "450px",
                      maxHeight: "650px",
                    }}
                  >
                    {timeoutPatients.length === 0 ? (
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
                          Nenhum paciente atrasado.
                        </Typography>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {timeoutPatients.map((paciente, index) => (
                          <React.Fragment key={paciente.pacienteId}>
                            <ListItem
                              sx={{
                                py: 2,
                                px: 3,
                                backgroundColor: "#ffebee",
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
                                      color: "error.main",
                                      mt: 0.5,
                                    }}
                                  >
                                    Removido por atraso
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
