import React, { useState, useEffect } from "react";
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
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getAnimalById,
  updateAnimal,
} from "../../services/AnimalService";

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

const AnimalEdit = () => {
  const { id } = useParams(); // ID da rota
  const navigate = useNavigate();

  const [animal, setAnimal] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    observacoes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await getAnimalById(id);
        setAnimal(response.data);
      } catch (err) {
        console.error("Erro ao buscar animal", err);
        setError("Erro ao carregar animal.");
      }
    };

    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAnimal(id, animal);
      navigate("/paciente/animais", {
        state: {
          message: "Animal atualizado com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar animal", err);
      setError("Erro ao atualizar animal.");
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
          <PaperWrapper sx={{ bgcolor: "background.default" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 9fr",
                alignItems: "center",
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
                  paddingRight: "85px",
                }}
              >
                Editar Animal
              </Title>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={3}
                sx={{
                  mt: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nome"
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    value={animal.nome}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="especie"
                    label="Espécie"
                    variant="outlined"
                    fullWidth
                    value={animal.especie}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="raca"
                    label="Raça"
                    variant="outlined"
                    fullWidth
                    value={animal.raca}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="idade"
                    label="Idade"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={animal.idade}
                    onChange={handleChange}
                  />
                </Grid>
               
                
              </Grid>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    mt: 1,
                  }}
                >
                  Atualizar Animal
                </Button>
              </Box>
            </form>
          </PaperWrapper>
        </Container>
      </Box>
    </Box>
  );
};

export default AnimalEdit;
