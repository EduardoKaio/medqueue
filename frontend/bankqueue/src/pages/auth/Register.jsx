import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";

// Estilos com `styled`
const Root = styled(Box)({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FF8F00",
});

const PaperWrapper = styled(Paper)({
  padding: "24px 32px",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  maxWidth: "600px",
  maxHeight: "600px",
  boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.29)",
  borderRadius: "16px",
});

const Title = styled(Typography)({
  marginBottom: 26,
});

const Register = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [sexo, setSexo] = useState("");
  const [error, setError] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoConta, setTipoConta] = useState("");
  const role = "ROLE_USER";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoPaciente = {
      nome,
      cpf,
      email,
      telefone,
      dataNascimento,
      endereco,
      sexo,
      senha,
      tipoConta,
      role,
    };

    try {
      await register(novoPaciente);
      navigate("/login", {
        state: {
          message: "Paciente registrado com sucesso!",
          severity: "success",
        },
      });
    } catch (err) {
      console.error("Erro ao criar paciente", err);
      setError("Erro ao criar paciente.");
    }
  };

  return (
    <Root>
      <PaperWrapper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 9fr",
          }}
        >
          <Link to="/login">
            <ArrowBackIcon sx={{ mt: "4px" }} />
          </Link>

          <Title
            variant="h5"
            sx={{
              display: "flex",
              justifySelf: "center",
              paddingRight: "60px",
            }}
          >
            Cadastro
          </Title>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 12 }} sx={{ mt: "5px" }}>
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 6 }}>
              <TextField
                label="CPF"
                variant="outlined"
                fullWidth
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 6 }}>
              <TextField
                label="Telefone"
                variant="outlined"
                fullWidth
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Endereço"
                variant="outlined"
                fullWidth
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </Grid>
            <Grid item size={{ xs: 6, sm: 6 }}>
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
            <Grid item size={{ xs: 6, sm: 6 }}>
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
            <Grid item size={{ xs: 12, sm: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Conta</InputLabel>
                <Select
                  value={tipoConta}
                  onChange={(e) => setTipoConta(e.target.value)}
                  label="Tipo de Conta"
                >
                  <MenuItem value="CORRENTE">Corrente</MenuItem>
                  <MenuItem value="POUPANCA">Poupança</MenuItem>
                  <MenuItem value="SALARIO">Salário</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="senha"
                variant="outlined"
                fullWidth
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                type="password"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
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
    </Root>
  );
};

export default Register;
