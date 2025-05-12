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
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  listarFilaOrdenada,
  realizarCheckIn,
  marcarComoAtrasado,
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
  const [delayedPatients, setDelayedPatients] = useState([]);
  const [firstInQueueTimestamp, setFirstInQueueTimestamp] = useState(null);
  const [firstPatientId, setFirstPatientId] = useState(null);

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
          setFirstInQueueTimestamp(Date.now());
        }
      } else {
        setFirstPatientId(null);
        setFirstInQueueTimestamp(null);
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
    if (firstInQueueTimestamp && firstPatientId) {
      // Função que verifica o tempo e move o paciente se necessário
      const verificarTimeout = () => {
        const currentTime = Date.now();
        const waitTime = currentTime - firstInQueueTimestamp;

        if (waitTime >= 300000) {
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

          setFirstInQueueTimestamp(null);
          setFirstPatientId(null);
        }
      };

      const intervalo = setInterval(verificarTimeout, 1000);
      return () => clearInterval(intervalo);
    }
  }, [firstInQueueTimestamp, firstPatientId, fetchPacientes, id]);

  const handleCheckIn = async (pacienteId) => {
    try {
      await realizarCheckIn(id, pacienteId);
      if (pacienteId === firstPatientId) {
        setFirstInQueueTimestamp(null);
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
    (p) =>
      (p.checkIn || p.status === "Atendido" || p.status === "Em atendimento") &&
      !delayedPatients.includes(p.pacienteId) &&
      p.status !== "Atrasado"
  );
  const inQueuePatients = pacientes.filter(
    (p) =>
      !p.checkIn &&
      p.status === "Na fila" &&
      !delayedPatients.includes(p.pacienteId)
  );
  const timeoutPatients = pacientes.filter(
    (p) => p.status === "Atrasado" || delayedPatients.includes(p.pacienteId)
  );

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
              {/* Coluna esquerda - Em atendimento/Atendidos */}
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

              {/* Área direita - Dividida em seções lado a lado */}
              <Grid item xs={12} md={6}>
                {/* Grid aninhado para layout lado a lado */}
                <Grid container spacing={3}>
                  {/* Seção Na fila - Lado esquerdo da coluna direita */}
                  <Grid item xs={12} sm={6}>
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
                                    backgroundColor:
                                      index === 0
                                        ? firstInQueueTimestamp &&
                                          Date.now() - firstInQueueTimestamp >
                                            240000
                                          ? "#ffe0e0"
                                          : "#fff3e0"
                                        : "#fff3e0",
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
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      #{index + 1} - {paciente.nomePaciente}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color:
                                          index === 0 &&
                                          firstInQueueTimestamp &&
                                          Date.now() - firstInQueueTimestamp >
                                            240000
                                            ? "error.main"
                                            : "warning.main",
                                        mt: 0.5,
                                      }}
                                    >
                                      {index === 0
                                        ? firstInQueueTimestamp &&
                                          Date.now() - firstInQueueTimestamp >
                                            240000
                                          ? "Prestes a ser removido!"
                                          : "Primeiro da fila"
                                        : "Na fila"}
                                    </Typography>
                                    {index === 0 && firstInQueueTimestamp && (
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary" }}
                                      >
                                        Tempo restante:{" "}
                                        {Math.max(
                                          0,
                                          Math.floor(
                                            (300000 -
                                              (Date.now() -
                                                firstInQueueTimestamp)) /
                                              1000
                                          )
                                        )}{" "}
                                        segundos
                                      </Typography>
                                    )}
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

                  {/* Seção Atrasados/Removidos - Lado direito da coluna direita */}
                  <Grid item xs={12} sm={6}>
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
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                      handleCheckIn(paciente.pacienteId)
                                    }
                                    sx={{ ml: 2 }}
                                  >
                                    Check-in
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
