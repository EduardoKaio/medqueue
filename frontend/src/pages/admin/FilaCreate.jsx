import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { criarFila } from "../../services/FilaService";

const FilaCreate = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [especialidade, setEspecialidade] = useState("");
  
  const [tempoMedio, setTempoMedio] = useState(0.0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nome.trim() === "") {
      setError("O nome da fila é obrigatório.");
      return;
    }

    if (Number(tempoMedio) < 0) {
      setError("O tempo médio não pode ser negativo.");
      return;
    }

    const novaFila = {
      nome,
      descricao,
      ativo,
      tempo_medio: Number(tempoMedio),
      especialidade,

    };

    try {
      await criarFila(novaFila);
      navigate("/admin/filas", {
        state: {
          message: "Fila criada com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao criar fila", err);

      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else {
          setError("Erro ao criar fila. Verifique os dados informados.");
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Erro ao criar fila. Verifique sua conexão e tente novamente."
        );
      }
    }
  };

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
              Adicionar Nova Fila
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

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Especialidade"
                  variant="outlined"
                  fullWidth
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Adicionar Fila
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default FilaCreate;
