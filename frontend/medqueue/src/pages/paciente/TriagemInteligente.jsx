import React, { useState, useEffect } from "react";
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
import { avaliarPrioridade } from "../../services/LLMService";
import MuiAlert from "@mui/material/Alert";
import { enterQueue, getCurrentUser } from "../../services/PacienteService";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import { Link } from "react-router-dom";

import { styled } from "@mui/material/styles";

function TriagemInteligente() {
  const [sintomas, setSintomas] = useState("");
  const [resultadoTriagem, setResultadoTriagem] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarErro, setSnackbarErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [filaNaoEncontrada, setFilaNaoEncontrada] = useState(false);
  const [queueSubjectDTO, setQueueSubjectDTO] = useState({
    userId: null,
    entityId: null,
  });

  const fetchPaciente = () => {
    getCurrentUser()
      .then((res) => {
        setQueueSubjectDTO((prevDto) => ({
          ...prevDto,
          userId: res.data.id,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchPaciente();
  }, []);

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

      // Avalia prioridade (agora retorna todos os dados necessários)
      const resposta = await avaliarPrioridade(sintomas);
      setResultadoTriagem({
        prioridade: resposta.prioridade,
        especialista: resposta.especialista,
        justificativaPrioridade: resposta.justificativaPrioridade,
        justificativaEspecialista: resposta.justificativaEspecialista,
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

    console.log(queueSubjectDTO);

    try {
      if (!filaNaoEncontrada) {
        await enterQueue(
          resultadoTriagem.especialista,
          resultadoTriagem.prioridade,
          queueSubjectDTO,
        );
        setSnackbarAberto(true);
      } else {
        // Tentar entrar na fila geral
        await enterQueue("geral", resultadoTriagem.prioridade, queueSubjectDTO);
        setFilaNaoEncontrada(false);
        setSnackbarAberto(true);
      }
    } catch (err) {
      if (err.response) {
        const { errorCode, message } = err.response.data || {};

        switch (errorCode) {
          case "FILA_NAO_ENCONTRADA":
            setFilaNaoEncontrada(true);
            break;
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
            console.log(err)
        }
      } else {
        setMensagemErro(
          "Erro ao conectar com o servidor. Verifique sua conexão."
        );
        setSnackbarErro(true);
      }

      setModalAberto(false);
    }
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 9fr",
            }}
          >
            <Link to="/paciente">
              <ArrowBackIcon sx={{ mt: "4px" }} />
            </Link>

            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: "bold",
                display: "flex",
                justifySelf: "center",
                paddingRight: "60px",
              }}
            >
              Triagem Inteligente
            </Typography>
          </Box>

          {/* Passo 1 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: "20px" }}>
                Descreva seus sintomas
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
              <Grid
                container
                spacing={2}
                mt={1}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={12} sm={6} sx={{ mt: "10px" }}>
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
            resultadoTriagem && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultado
                  </Typography>
                  <>
                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 12, sm: 12 }}>
                        <TriagemTooltip
                          title={
                            <React.Fragment>
                              <Typography color="inherit">
                                Justificativa da prioridade:
                              </Typography>
                              {resultadoTriagem.justificativaPrioridade}
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
                            Prioridade: Nível {resultadoTriagem.prioridade}
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
                              {resultadoTriagem.justificativaEspecialista}
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
                            Especialista: {resultadoTriagem.especialista}
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
            <strong>Nível {resultadoTriagem?.prioridade}</strong>. Deseja
            continuar?
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
            Não encontramos nenhuma fila com a especialidade "
            {resultadoTriagem?.especialista}". Deseja entrar na primeira fila
            disponível mantendo sua prioridade?
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

      {/* Snackbar de confirmação de sucesso */}
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
  );
}

export default TriagemInteligente;
