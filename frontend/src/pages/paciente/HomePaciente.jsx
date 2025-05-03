import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { enterQueue } from "../../services/PacienteService";

function HomePaciente() {
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleEntrarNaFila = () => {
    setConfirmDialogOpen(true); // Abre o modal de confirmação
  };

  const handleConfirmarEntradaFila = async (e) => {
    e.preventDefault();

    try {
      await enterQueue();
    } catch (err) {
      console.error("Erro ao criar paciente", err);
    }

    setConfirmDialogOpen(false); // Fecha o modal
    setShowAlert(true); // Exibe o alerta de confirmação
  };

  const handleTriagem = () => {
    navigate("/paciente/triagem");
  };

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
                Aqui você pode entrar diretamente na fila ou realizar uma
                triagem inteligente para obter um atendimento mais preciso.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleEntrarNaFila}
                >
                  Entrar na Fila
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleTriagem}
                >
                  Triagem Inteligente
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
              Você está prestes a entrar na fila{" "}
              <strong>sem realizar a triagem</strong>. Isso significa que sua
              prioridade será definida automaticamente como{" "}
              <strong>3 (baixa)</strong>. Deseja continuar assim mesmo?
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
            Você foi inserido na fila com prioridade <strong>3 (baixa)</strong>
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default HomePaciente;
