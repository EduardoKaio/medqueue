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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";

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
            <Link to="/login">
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
              Cadastro
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
                  label="Nome Completo"
                  variant="outlined"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CPF"
                  variant="outlined"
                  fullWidth
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-mail"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  variant="outlined"
                  fullWidth
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Endereço"
                  variant="outlined"
                  fullWidth
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  <FormHelperText>
                    Selecione seu gênero
                  </FormHelperText>
                </FormControl>
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
                Cadastre-se
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
