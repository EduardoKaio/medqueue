import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  getHistoricoSms,
  getContadorSms,
  enviarSmsTeste,
} from "../../services/SmsService";

const HistoricoSms = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contador, setContador] = useState(0);
  const [telefoneTest, setTelefoneTest] = useState("");
  const [nomeTest, setNomeTest] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historicoResponse, contadorResponse] = await Promise.all([
        getHistoricoSms(),
        getContadorSms(),
      ]);
      setNotifications(historicoResponse);
      setContador(contadorResponse.totalSmsEnviados);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar histórico de SMS");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarTeste = async () => {
    if (!telefoneTest.trim()) {
      setError("Digite um número de telefone para o teste");
      return;
    }

    try {
      setSendingTest(true);
      await enviarSmsTeste(telefoneTest, nomeTest || "Cliente Teste");
      setTelefoneTest("");
      setNomeTest("");
      fetchData(); // Recarregar os dados
      setError(null);
    } catch (err) {
      setError("Erro ao enviar SMS de teste");
      console.error("Erro:", err);
    } finally {
      setSendingTest(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ENVIADO":
        return "success";
      case "ERRO":
        return "error";
      case "PENDENTE":
        return "warning";
      default:
        return "default";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "ENTRADA_FILA":
        return "primary";
      case "PROXIMO_ATENDIMENTO":
        return "warning";
      case "CHECK_IN":
        return "info";
      case "ATENDIMENTO_CONCLUIDO":
        return "success";
      case "ALERTA_ATRASO":
        return "error";
      case "REMOVIDO_FILA":
        return "default";
      default:
        return "secondary";
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
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Link to="/admin/filas">
              <IconButton
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography
              variant="h4"
              sx={{ color: "primary.main", fontWeight: "bold", flexGrow: 1 }}
            >
              Histórico de SMS - BankQueue
            </Typography>
            <IconButton
              onClick={fetchData}
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "secondary.dark",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Card de Estatísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    📊 Estatísticas
                  </Typography>
                  <Typography variant="h4" color="text.primary">
                    {contador}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de SMS enviados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    🧪 Teste de SMS
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    <TextField
                      label="Telefone"
                      value={telefoneTest}
                      onChange={(e) => setTelefoneTest(e.target.value)}
                      placeholder="(11) 99999-9999"
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Nome (opcional)"
                      value={nomeTest}
                      onChange={(e) => setNomeTest(e.target.value)}
                      placeholder="Nome do cliente"
                      size="small"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      onClick={handleEnviarTeste}
                      disabled={sendingTest}
                      startIcon={
                        sendingTest ? <CircularProgress size={16} /> : <SendIcon />
                      }
                    >
                      {sendingTest ? "Enviando..." : "Enviar Teste"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: "20px", overflow: "hidden" }}>
              <Box sx={{ p: 3, backgroundColor: "#1976d2", color: "white" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  📱 Histórico de Notificações SMS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {notifications.length} notificações registradas
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data/Hora</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Mensagem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            Nenhuma notificação SMS encontrada
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      notifications.map((notification, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            {formatDate(notification.dataEnvio)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {notification.telefone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={notification.tipo}
                              color={getTipoColor(notification.tipo)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={notification.status}
                              color={getStatusColor(notification.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={notification.mensagem}
                            >
                              {notification.mensagem}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HistoricoSms;
