import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { enterQueue, getCurrentUser } from "../../services/PacienteService";

function HomePaciente() {
  const [showAlert, setShowAlert] = useState(false);
  const [snackbarErro, setSnackbarErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const filaOptions = [
    { label: "Caixa Eletrônico", value: "Caixa Eletrônico" },
    { label: "Guichê de Atendimento", value: "Guichê de Atendimento" },
    { label: "Gerente de Conta", value: "Gerente de Conta" },
  ];
  const [filaSelecionada, setFilaSelecionada] = useState("");

  // Novos estados para perguntas de prioridade
  const [deficiente, setDeficiente] = useState("");
  const [gestante, setGestante] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [userId, setUserId] = useState(null);

  // Busca o usuário atual para preencher dados do cadastro
  const fetchPaciente = () => {
    getCurrentUser()
      .then((res) => {
        setUserId(res.data && res.data.id ? res.data.id : null);
        setSexo(res.data && res.data.sexo ? res.data.sexo : "");
        setDataNascimento(
          res.data && res.data.dataNascimento ? res.data.dataNascimento : ""
        );
      })
      .catch((err) => {
        console.error("Erro ao encontrar dados do paciente", err);
      });
  };

  useEffect(() => {
    fetchPaciente();
  }, []);

  // Abre o modal de confirmação
  const handleEntrarNaFila = () => {
    if (!filaSelecionada) {
      setMensagemErro("Selecione uma fila antes de confirmar.");
      setSnackbarErro(true);
      return;
    }
    setConfirmDialogOpen(true);
  };

  // Confirma a entrada na fila
  const handleConfirmarEntradaFila = async (e) => {
    e.preventDefault();
    // Calcula prioridade baseada nos dados do paciente usando a escala do BankQueue
    // 1 = prioridade alta (deficiente, idoso, gestante)
    // 3 = prioridade comum (sem condições especiais)
    const temPrioridade =
      deficiente === "sim" || (sexo === "F" && gestante === "sim");
    const prioridade = temPrioridade ? 1 : 3;

    // Monta o objeto queueSubject com dados do paciente
    const queueSubjectData = {
      userId: userId,
      entityId: userId,
      deficiente: deficiente === "sim",
      sexo,
      gestante: sexo === "F" ? gestante === "sim" : false,
      dataNascimento,
    };

    try {
      await enterQueue(filaSelecionada, prioridade, queueSubjectData);
      setShowAlert(true); // Exibe o alerta de confirmação
    } catch (err) {
      if (err.response && err.response.data) {
        const { errorCode, message } = err.response.data;
        switch (errorCode) {
          case "PACIENTE_JA_NA_FILA":
          case "PACIENTE_EM_OUTRA_FILA":
            setMensagemErro(message);
            setSnackbarErro(true);
            break;
          default:
            setMensagemErro(
              "Erro ao entrar na fila. Tente novamente mais tarde."
            );
            setSnackbarErro(true);
        }
      } else {
        setMensagemErro(
          "Erro ao conectar com o servidor. Verifique sua conexão."
        );
        setSnackbarErro(true);
      }
    }
    setConfirmDialogOpen(false); // Fecha o modal
  };

  // Removido botão de triagem

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Bem-vindo à sua área de atendimento
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Escolha a fila desejada e informe seus dados para entrar na fila
                de atendimento.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="fila-select-label">Fila</InputLabel>
                  <Select
                    labelId="fila-select-label"
                    value={filaSelecionada}
                    label="Fila"
                    onChange={(e) => setFilaSelecionada(e.target.value)}
                  >
                    {filaOptions.map((fila) => (
                      <MenuItem key={fila.value} value={fila.value}>
                        {fila.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Pergunta: Pessoa com deficiência */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="deficiente-label">
                    Pessoa com deficiência?
                  </InputLabel>
                  <Select
                    labelId="deficiente-label"
                    value={deficiente}
                    label="Pessoa com deficiência?"
                    onChange={(e) => setDeficiente(e.target.value)}
                  >
                    <MenuItem value="sim">Sim</MenuItem>
                    <MenuItem value="nao">Não</MenuItem>
                  </Select>
                </FormControl>

                {/* Pergunta: Gestante (apenas se mulher) */}
                {sexo === "F" && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="gestante-label">Está grávida?</InputLabel>
                    <Select
                      labelId="gestante-label"
                      value={gestante}
                      label="Está grávida?"
                      onChange={(e) => setGestante(e.target.value)}
                    >
                      <MenuItem value="sim">Sim</MenuItem>
                      <MenuItem value="nao">Não</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleEntrarNaFila}
                  disabled={
                    !filaSelecionada ||
                    !deficiente ||
                    (sexo === "F" && !gestante)
                  }
                >
                  Entrar na Fila
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>

        {/* Modal de confirmação */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>Entrar na Fila</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mt: 1 }}>
              Confira suas respostas antes de entrar na fila.
              <br />
              Sua prioridade será definida automaticamente conforme as
              informações fornecidas:
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>
                  Deficiência:{" "}
                  <strong>{deficiente === "sim" ? "Sim" : "Não"}</strong>
                </li>
                {sexo === "F" && (
                  <li>
                    Gestante:{" "}
                    <strong>{gestante === "sim" ? "Sim" : "Não"}</strong>
                  </li>
                )}
              </ul>
              Deseja continuar?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                color: "error.main",
                fontWeight: "bold",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)", // vermelho claro com transparência
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarEntradaFila}
              sx={{
                color: "success.main",
                fontWeight: "bold",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(46, 125, 50, 0.1)", // verde claro com transparência
                },
              }}
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alerta de confirmação */}
        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            severity="success"
            onClose={() => setShowAlert(false)}
            elevation={6}
            variant="filled"
          >
            Você foi inserido na fila com prioridade <strong>normal</strong>
          </MuiAlert>
        </Snackbar>

        {/* Snackbar de erro */}
        <Snackbar
          open={snackbarErro}
          autoHideDuration={6000}
          onClose={() => setSnackbarErro(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            severity="error"
            onClose={() => setSnackbarErro(false)}
            elevation={6}
            variant="filled"
          >
            {mensagemErro}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default HomePaciente;
