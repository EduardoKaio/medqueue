import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { buscarFilaPorId, atualizarFila } from "../../services/FilaService";

const FilaEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [prioridade, setPrioridade] = useState(0);
  const [tempoMedio, setTempoMedio] = useState(0.0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosFila = async () => {
      try {
        const response = await buscarFilaPorId(id);
        const fila = response.data;
        setNome(fila.nome);
        setDescricao(fila.descricao || "");
        setAtivo(fila.ativo);
        setPrioridade(fila.prioridade);
        setTempoMedio(fila.tempoMedio);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados da fila:", err);
        setError(
          "Não foi possível carregar os dados da fila. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    carregarDadosFila();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filaAtualizada = {
        nome,
        descricao,
        ativo,
        prioridade: Number(prioridade),
        tempoMedio: Number(tempoMedio),
      };

      await atualizarFila(id, filaAtualizada);

      navigate("/admin/filas", {
        state: {
          message: "Fila atualizada com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar fila:", err);

      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else {
          setError(
            "Erro ao atualizar fila. Verifique os dados e tente novamente."
          );
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Erro ao atualizar fila. Verifique sua conexão e tente novamente."
        );
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Link to="/admin/filas">
              <IconButton
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: 2,
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
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                textAlign: "center",
              }}
            >
              Editar Fila
            </Typography>
            <Box width="40px" /> {/* espaçamento para balancear visualmente */}
          </Box>

          {error && (
            <Box sx={{ mb: 2, color: "error.main" }}>
              <Typography>{error}</Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome da Fila"
                  variant="outlined"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prioridade"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tempo Médio (minutos)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  inputProps={{ step: "0.01" }}
                  value={tempoMedio}
                  onChange={(e) => setTempoMedio(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={ativo}
                      onChange={(e) => setAtivo(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Fila Ativa"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Salvar Alterações
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default FilaEdit;
