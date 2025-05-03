import React, { useState } from "react";
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
  FormControlLabel,
  Switch,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { createPaciente } from "../../services/GerenciamentoPacienteService";

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

const PacienteCreate = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [sexo, setSexo] = useState("");
  const [error, setError] = useState("");
  const [ativo, setAtivo] = useState(false);
  const [role, setRole] = useState("");
  const senha = "123456";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRole(ativo ? "ROLE_ADMIN" : "ROLE_USER");

    const novoPaciente = {
      nome,
      cpf,
      email,
      telefone,
      dataNascimento,
      endereco,
      sexo,
      senha,
      role,
    };

    try {
      await createPaciente(novoPaciente);
      navigate("/admin/pacientes", {
        state: {
          message: "Paciente criado com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao criar paciente", err);
      setError("Erro ao criar paciente.");
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
          <PaperWrapper>
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
                  paddingRight: "90px",
                }}
              >
                Adicionar Novo Paciente
              </Title>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: "5px" }}>
                <Grid item size={{ xs: 12, sm: 8 }}>
                  <TextField
                    label="Nome Completo"
                    variant="outlined"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 4 }}>
                  <TextField
                    label="CPF"
                    variant="outlined"
                    fullWidth
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 4 }}>
                  <TextField
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 8 }}>
                  <TextField
                    label="E-mail"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 8 }}>
                  <TextField
                    label="Endereço"
                    variant="outlined"
                    fullWidth
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 4 }}>
                  <TextField
                    label="Data de Nascimento"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
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
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      label="Gênero"
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Feminino</MenuItem>
                      <MenuItem value="Outro">Outro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 12, sm: 5 }}>
                  <TextField
                    label="senha"
                    variant="outlined"
                    fullWidth
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled
                    type="password"
                  />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, sm: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ativo}
                        onChange={(e) => setAtivo(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Admin"
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
                  Cadastre-se
                </Button>
              </Box>
            </form>
          </PaperWrapper>
        </Container>
      </Box>
    </Box>
  );
};

export default PacienteCreate;
