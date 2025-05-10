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
} from "@mui/material";
import {
  avaliarPrioridade,
  recomendarEspecialista,
} from "../../services/LLMService";
import MuiAlert from "@mui/material/Alert";
import { enterQueue } from "../../services/PacienteService";

function TriagemInteligente() {
  const [sintomas, setSintomas] = useState("");
  const [prioridade, setPrioridade] = useState(null);
  const [recomendacao, setRecomendacao] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAvaliarPrioridade = async () => {
    setLoading(true);

    // Simulação do tempo de loading - 3 segundos
    const TEMPO_SIMULADO_MS = 1000;

    setTimeout(async () => {
      try {
        const resposta = await avaliarPrioridade(sintomas);
        setPrioridade({
          nivel: resposta.prioridade,
          justificativa: resposta.resposta,
        });
        setRecomendacao(null);
      } catch (error) {
        // Verifica se o erro é um erro de resposta da API
        if (error.response) {
          // O servidor respondeu com um erro (ex: 400 ou 404)
          console.error("Erro ao avaliar prioridade:", error.response.data);
          alert("Erro: " + error.response.data.erro); // Exibe a mensagem de erro
        } else {
          // Outros erros, como problemas de rede
          console.error("Erro desconhecido:", error);
          alert("Erro desconhecido. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    }, TEMPO_SIMULADO_MS);
  };

  const handleEntrarNaFila = async (e) => {
    e.preventDefault();

    try {
      await enterQueue();
      console.log("Entrou na fila com prioridade", prioridade.nivel);
    } catch (err) {
      console.error("Erro ao entrar na fila", err);
    }

    setModalAberto(false);
    setSnackbarAberto(true);
  };

  const handleRecomendarEspecialista = async () => {
    setLoading(true);

    const TEMPO_SIMULADO_MS = 1000;

    setTimeout(async () => {
      try {
        const resposta = await recomendarEspecialista(sintomas);
        setRecomendacao({
          especialista: resposta.recomendacao_especialista,
          justificativa: resposta.justificativa,
        });
        setPrioridade(null);
      } catch (error) {
        // Verifica se o erro é um erro de resposta da API
        if (error.response) {
          // O servidor respondeu com um erro (ex: 400 ou 404)
          console.error(
            "Erro ao recomendar especialista:",
            error.response.data
          );
          alert("Erro: " + error.response.data.erro); // Exibe a mensagem de erro
        } else {
          // Outros erros, como problemas de rede
          console.error("Erro desconhecido:", error);
          alert("Erro desconhecido. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    }, TEMPO_SIMULADO_MS);
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
                    onClick={handleAvaliarPrioridade}
                  >
                    Avaliar Prioridade
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleRecomendarEspecialista}
                  >
                    Recomendar Especialista
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
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <strong>Prioridade:</strong> Nível {prioridade.nivel}
                        <br />
                        <strong>Justificativa:</strong>{" "}
                        {prioridade.justificativa}
                      </Alert>

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
                  {recomendacao && (
                    <Alert severity="info">
                      <strong>Especialista sugerido:</strong>{" "}
                      {recomendacao.especialista}
                      <br />
                      <strong>Justificativa:</strong>{" "}
                      {recomendacao.justificativa}
                    </Alert>
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
