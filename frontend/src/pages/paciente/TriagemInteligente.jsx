import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import {
  avaliarPrioridade,
  recomendarEspecialista,
} from "../../services/LLMService";
import MuiAlert from "@mui/material/Alert";
import { enterQueue } from "../../services/PacienteService";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { styled } from "@mui/material/styles";

function TriagemInteligente() {
  const [sintomas, setSintomas] = useState("");
  const [prioridade, setPrioridade] = useState(null);
  const [recomendacao, setRecomendacao] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filaNaoEncontrada, setFilaNaoEncontrada] = useState(false);

  const TriagemTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 500,
      fontSize: theme.typography.pxToRem(16),
      border: "1px solid #dadde9",
    },
  }));

  const handleRealizarTriagem = async () => {
    setLoading(true);

    try {
      // Simula tempo de processamento, se necessário
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Avalia prioridade
      const respostaPrioridade = await avaliarPrioridade(sintomas);
      setPrioridade({
        nivel: respostaPrioridade.prioridade,
        justificativa: respostaPrioridade.resposta,
      });

      // Recomenda especialista
      const respostaEspecialista = await recomendarEspecialista(sintomas);
      setRecomendacao({
        especialista: respostaEspecialista.recomendacao_especialista,
        justificativa: respostaEspecialista.justificativa,
      });
    } catch (error) {
      if (error.response) {
        // Erro retornado pela API
        console.error("Erro:", error.response.data);
        alert(
          "Erro: " + (error.response.data.erro || "Ocorreu um erro na triagem.")
        );
      } else {
        // Erro de rede ou outro
        console.error("Erro desconhecido:", error);
        alert("Erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEntrarNaFila = async (e) => {
    e.preventDefault();

    try {
      if (!filaNaoEncontrada) {
        await enterQueue(recomendacao.especialista, prioridade.nivel);
        console.log("Entrou na fila com prioridade", prioridade.nivel);
        setSnackbarAberto(true);
      } else {
        await enterQueue("geral", prioridade.nivel);
        console.log("Entrou na fila com prioridade", prioridade.nivel);
        setFilaNaoEncontrada(false);
        setSnackbarAberto(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const mensagem = err.response.data;

        console.error("Erro: ", mensagem);

        setFilaNaoEncontrada(true);
      } else {
        console.error("Erro ao entrar na fila", err);
      }
    }

    setModalAberto(false);
  };

  const LoadingComponent = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <Box textAlign="center">
        <Typography variant="h6" mb={2}>
          Analisando seus sintomas...
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            width: 60,
            height: 60,
            border: "6px solid #3f51b5",
            borderRadius: "50%",
            borderTop: "6px solid transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Triagem Inteligente
          </Typography>

          {/* Passo 1 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. Descreva seus sintomas
              </Typography>
              <TextField
                label="Digite seus sintomas"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Passo 2 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2. O que você deseja fazer?
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRealizarTriagem}
                  >
                    Realizar Triagem
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Resultado */}
          {loading ? (
            <Card>
              <CardContent>
                <LoadingComponent />
              </CardContent>
            </Card>
          ) : (
            (prioridade || recomendacao) && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultado
                  </Typography>
                  {prioridade && (
                    <>
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 12 }}>
                          <TriagemTooltip
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Justificativa da prioridade:
                                </Typography>
                                {prioridade.justificativa}
                              </React.Fragment>
                            }
                            arrow
                            placement="right"
                          >
                            <Button
                              variant="contained"
                              color="warning"
                              startIcon={<PriorityHighIcon />}
                            >
                              Prioridade: Nível {prioridade.nivel}
                            </Button>
                          </TriagemTooltip>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 12 }}>
                          <TriagemTooltip
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Justificativa da Recomendação:
                                </Typography>
                                {recomendacao.justificativa}
                              </React.Fragment>
                            }
                            arrow
                            placement="right"
                          >
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<LocalHospitalIcon />}
                            >
                              Especialista: {recomendacao.especialista}
                            </Button>
                          </TriagemTooltip>
                        </Grid>
                      </Grid>

                      <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => {
                            setModalAberto(true);
                          }}
                        >
                          Entrar na fila
                        </Button>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </Container>
      </Box>

      {/* Modal de confirmação */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle>Confirmar Entrada na Fila</DialogTitle>
        <DialogContent>
          <Typography>
            Você está prestes a entrar na fila com prioridade{" "}
            <strong>Nível {prioridade?.nivel}</strong>. Deseja continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModalAberto(false)}
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
        open={filaNaoEncontrada}
        onClose={() => setFilaNaoEncontrada(false)}
      >
        <DialogTitle>Fila com especialidade não encontrada</DialogTitle>
        <DialogContent>
          <Typography>
            Não encotramos nenhuma fila com a especialidade esperada. Deseja
            entrar em uma fila geral mantendo sua prioridade?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setFilaNaoEncontrada(false)}
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

      {/* Snackbar de confirmação */}
      <Snackbar
        open={snackbarAberto}
        autoHideDuration={4000}
        onClose={() => setSnackbarAberto(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          severity="success"
          onClose={() => setSnackbarAberto(false)}
          elevation={6}
          variant="filled"
        >
          Você foi adicionado à fila com sucesso!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default TriagemInteligente;
