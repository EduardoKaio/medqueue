import React, { useState, useEffect } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { enterQueue, getCurrentUser } from "../../services/PacienteService";
import { getAnimalsByDono } from "../../services/AnimalService";

function HomePaciente() {
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selecionarAnimalDialog, setSelecionarAnimalDialog] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState();

  const [animaisDoUsuario, setAnimaisDoUsuario] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState(Number); // Armazena o ID do animal selecionado
  const [loadingAnimais, setLoadingAnimais] = useState(true);
  const [erroAoCarregarAnimais, setErroAoCarregarAnimais] = useState(null);

  const [queueSubjectDTO, setQueueSubjectDTO] = useState({
    userId: null,
    entityId: null,
  });

  const fetchPaciente = () => {
    getCurrentUser()
      .then((res) => setUserId(res.data.id))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchPaciente();
  }, []);

  const fetchAnimais = async () => {
    setLoadingAnimais(true);
    setErroAoCarregarAnimais(null);
    try {
      getAnimalsByDono(userId)
        .then((res) => setAnimaisDoUsuario(res.data))
        .catch((err) => {
          console.error(err);
        });

      if (animaisDoUsuario.length > 0) {
        setAnimalSelecionado(animaisDoUsuario[0].id); // Seleciona o primeiro por padrão
      }
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      setErroAoCarregarAnimais(
        "Não foi possível carregar seus animais. Tente novamente."
      );
    } finally {
      setLoadingAnimais(false);
    }
  };

  const handleChangeAnimal = (event) => {
    setAnimalSelecionado(event.target.value);
  };

  const handleEntrarNaFila = () => {
    console.log(animalSelecionado)
    setQueueSubjectDTO({
      userId: userId,
      entityId: animalSelecionado
    })
    console.log(queueSubjectDTO)
    setConfirmDialogOpen(true); // Abre o modal de confirmação
  };

  const handleSelecionarAnimal = () => {
    fetchAnimais();
    setSelecionarAnimalDialog(true); //Abre modal para selecionar o animal que vai entrar na fila
  };

  const handleConfirmarEntradaFila = async (e) => {
    e.preventDefault();

    try {
      await enterQueue("geral", 3, queueSubjectDTO);
      setShowAlert(true); // Exibe o alerta de confirmação
    } catch (err) {
      console.error("Erro ao entrar na fila", err);
    }

    setConfirmDialogOpen(false); // Fecha o modal
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
                  onClick={handleSelecionarAnimal}
                >
                  Abrir Seleção de Animal
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
          open={selecionarAnimalDialog}
          onClose={() => setSelecionarAnimalDialog(false)}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>Entrar na Fila</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mt: 1 }}>
              Antes de entrar na fila Selecione qual dos seus animais deverá ser
              o que vai entrar na fila.
            </DialogContentText>

            {loadingAnimais ? (
              <CircularProgress
                sx={{ display: "block", margin: "20px auto" }}
              />
            ) : erroAoCarregarAnimais ? (
              <Typography color="error" sx={{ mt: 2 }}>
                {erroAoCarregarAnimais}
              </Typography>
            ) : animaisDoUsuario.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Você não possui animais cadastrados para entrar na fila.
              </Typography>
            ) : (
              <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
                <FormLabel
                  component="legend"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Seus Animais
                </FormLabel>
                <RadioGroup
                  aria-label="animais"
                  name="animalSelection"
                  value={animalSelecionado}
                  onChange={handleChangeAnimal}
                >
                  {animaisDoUsuario.map((animal) => (
                    <FormControlLabel
                      key={animal.id}
                      value={animal.id}
                      control={<Radio />}
                      label={animal.nome}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setSelecionarAnimalDialog(false)}
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
              onClick={handleEntrarNaFila}
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
