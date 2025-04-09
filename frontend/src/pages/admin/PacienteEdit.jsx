import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import Header from "../../components/Header";
import { drawerWidth, drawerWidthClosed } from "../../components/Sidebar";
import { getPacienteById, updatePaciente } from "../../services/PacienteService";

const PacienteEdit = () => {
  const { id } = useParams(); // ID da rota
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const [paciente, setPaciente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    sexo: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await getPacienteById(id);
        setPaciente(response.data);
      } catch (err) {
        console.error("Erro ao buscar paciente", err);
        setError("Erro ao carregar paciente.");
      }
    };

    fetchPaciente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePaciente(id, paciente);
      navigate("/admin/pacientes", {
        state: {
          message: "Paciente atualizado com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar paciente", err);
      setError("Erro ao atualizar paciente.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          mt: 8,
        }}
      >
        <Header open={open} drawerWidth={drawerWidth} drawerWidthClosed={drawerWidthClosed} />

        <Container>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Link to="/admin/pacientes">
              <IconButton
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: 2,
                  '&:hover': { backgroundColor: "#1565c0" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1976d2", mx: "auto" }}
            >
              Editar Paciente
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Nome Completo", name: "nome", required: true },
                { label: "CPF", name: "cpf", required: true },
                { label: "E-mail", name: "email", required: true },
                { label: "Telefone", name: "telefone", required: true },
                {
                  label: "Data de Nascimento",
                  name: "dataNascimento",
                  type: "date",
                  shrink: true,
                  required: true,
                },
                { label: "Endereço", name: "endereco", required: true },
              ].map(({ label, name, type = "text", shrink = false, required }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    label={label}
                    fullWidth
                    name={name}
                    type={type}
                    required={required}
                    InputLabelProps={shrink ? { shrink: true } : undefined}
                    value={paciente[name]}
                    onChange={handleChange}
                  />
                </Grid>
              ))}

              {/* Campo de Gênero ocupando duas colunas */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    name="sexo"
                    value={paciente.sexo}
                    label="Gênero"
                    onChange={handleChange}
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Feminino</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
                  <FormHelperText>Selecione o gênero do paciente</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  '&:hover': { bgcolor: "#1565c0" },
                  borderRadius: 1,
                }}
              >
                Atualizar Paciente
              </Button>
            </Box>
          </form>

        </Container>
      </Box>
    </Box>
  );
};

export default PacienteEdit;
