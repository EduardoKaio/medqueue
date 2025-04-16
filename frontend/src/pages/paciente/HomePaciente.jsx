import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
    Home as HomeIcon,
    Assignment as AssignmentIcon,
    FormatListNumbered as QueueIcon,
  } from "@mui/icons-material";

import { Sidebar } from "../../components/Sidebar";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { drawerWidth, drawerWidthClosed } from "../../components/Sidebar";
import MuiAlert from "@mui/material/Alert";

function HomePaciente() {
  const [open, setOpen] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();
  const pacienteMenu = [
    { label: "Início", path: "/paciente", icon: <HomeIcon color="primary" /> },
    { label: "Triagem Inteligente", path: "/paciente/triagem", icon: <AssignmentIcon color="primary" /> },
    { label: "Fila Atual", path: "/paciente/fila", icon: <QueueIcon color="primary" /> },
  ];
  const handleEntrarNaFila = () => {
    setConfirmDialogOpen(true); // Abre o modal de confirmação
  };

  const handleConfirmarEntradaFila = () => {
    setConfirmDialogOpen(false); // Fecha o modal
    setShowAlert(true); // Exibe o alerta de confirmação
    // Aqui você pode adicionar uma chamada à API para adicionar o paciente à fila com prioridade 3
  };

  const handleTriagem = () => {
    navigate("/paciente/triagem");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} menuItems={pacienteMenu} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Header
          open={open}
          drawerWidth={drawerWidth}
          drawerWidthClosed={drawerWidthClosed}
          title="Área do Paciente"
        />
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Bem-vindo à sua área de atendimento
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Aqui você pode entrar diretamente na fila ou realizar uma triagem inteligente para obter um atendimento mais preciso.
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
        Você está prestes a entrar na fila <strong>sem realizar a triagem</strong>.
        Isso significa que sua prioridade será definida automaticamente como <strong>3 (baixa)</strong>.
        Deseja continuar assim mesmo?
        </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
        onClick={() => setConfirmDialogOpen(false)}
        sx={{
            color: 'error.main',
            fontWeight: 'bold',
            borderRadius: 1,
            '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.1)', // vermelho claro com transparência
            },
        }}
        >
        Cancelar
        </Button>
        <Button
        onClick={handleConfirmarEntradaFila}
        sx={{
            color: 'success.main',
            fontWeight: 'bold',
            borderRadius: 1,
            '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.1)', // verde claro com transparência
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
          <MuiAlert severity="success" onClose={() => setShowAlert(false)} elevation={6} variant="filled">
            Você foi inserido na fila com prioridade <strong>3 (baixa)</strong>
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default HomePaciente;
