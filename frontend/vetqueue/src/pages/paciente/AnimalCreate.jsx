import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { createAnimal } from "../../services/AnimalService";
import { jwtDecode } from "jwt-decode";

const PaperWrapper = styled(Paper)({
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: "16px",
  padding: "24px",
});

const Title = styled(Typography)({
  marginBottom: 18,
});

const AnimalCreate = () => {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");

  const decoded = token ? jwtDecode(token) : null;
  const cpf = decoded ? decoded.sub : null; // supondo que o CPF esteja no "sub"

  const navigate = useNavigate();
    // Função para buscar donoId via API pelo CPF
  async function getDonoIdByCpf(cpf) {
    try {
      const response = await fetch(`/api/animais/dono/${cpf}`);
      if (!response.ok) {
        throw new Error("Dono não encontrado");
      }
      const donoId = await response.json();
      return donoId;
    } catch (err) {
      throw err;
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const donoId = await getDonoIdByCpf(cpf);
    const novoAnimal = {
      nome,
      especie,
      raca,
      idade,
      donoId
    };

    try {
      await createAnimal(novoAnimal);
      navigate("/paciente/animais", {
        state: {
          message: "Animal criado com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao criar animal", err);
      setError("Erro ao criar animal.");
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
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <PaperWrapper sx={{ bgcolor: "background.default" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 9fr",
              }}
            >
              <Link to="/paciente/animais">
                <ArrowBackIcon sx={{ mt: "4px" }} />
              </Link>

              <Title
                variant="h5"
                sx={{
                  display: "flex",
                  justifySelf: "center",
                  paddingRight: "90px",
                }}
              >
                Adicionar Novo Animal
              </Title>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: "5px" }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Espécie"
                    variant="outlined"
                    fullWidth
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Raça"
                    variant="outlined"
                    fullWidth
                    value={raca}
                    onChange={(e) => setRaca(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    label="Idade"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                  />
                </Grid>
                
                
              </Grid>
              <Box sx={{ mt: 2 }}>
                {error && <Typography color="error">{error}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    mt: 1,
                  }}
                >
                  Cadastrar Animal
                </Button>
              </Box>
            </form>
          </PaperWrapper>
        </Container>
      </Box>
    </Box>
  );
};

export default AnimalCreate;
