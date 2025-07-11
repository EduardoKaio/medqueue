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
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getPacienteById,
  updatePaciente,
} from "../../services/GerenciamentoPacienteService";

const PaperWrapper = styled(Paper)({
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: "16px",
});

const Title = styled(Typography)({
  marginBottom: 18,
});

const PacienteEdit = () => {
  const { id } = useParams(); // ID da rota
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    sexo: "",
    senha: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await getPacienteById(id);
        setPaciente(response.data);
        setAtivo(paciente.role.includes("ADMIN"));
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

    const userAtualizado = {
      ...paciente,
      senha: "",
      role: ativo ? "ROLE_ADMIN" : "ROLE_USER",
    };

    try {
      await updatePaciente(id, userAtualizado);
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
              }}
            >
              <Link to="/admin/pacientes">
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
                Editar Paciente
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
                <Grid item size={{ xs: 12, sm: 8 }}>
                  <TextField
                    name="nome"
                    label="Nome Completo"
                    variant="outlined"
                    fullWidth
                    value={paciente.nome}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 5 }}>
                  <TextField
                    name="email"
                    label="E-mail"
                    variant="outlined"
                    fullWidth
                    value={paciente.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <TextField
                    name="telefone"
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    value={paciente.telefone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 8 }}>
                  <TextField
                    name="endereco"
                    label="Endereço"
                    variant="outlined"
                    fullWidth
                    value={paciente.endereco}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 5 }}>
                  <TextField
                    name="cpf"
                    label="CPF"
                    variant="outlined"
                    fullWidth
                    value={paciente.cpf}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <TextField
                    name="dataNascimento"
                    label="Data de Nascimento"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={paciente.dataNascimento}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 5 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Gênero</InputLabel>
                    <Select
                      name="sexo"
                      value={paciente.sexo}
                      onChange={handleChange}
                      label="Gênero"
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Feminino</MenuItem>
                      <MenuItem value="Outro">Outro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, sm: 3 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        name="role"
                        checked={ativo}
                        onChange={(e) => setAtivo(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Admin"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
                {error && <Typography color="error">{error}</Typography>}
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
                  Atualizar Paciente
                </Button>
              </Box>
            </form>
          </PaperWrapper>

          {/* <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
          </form> */}
        </Container>
      </Box>
    </Box>
  );
};

export default PacienteEdit;
