import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";

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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "300px",
  boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.29)",
  borderRadius: "16px",
});

const Title = styled(Typography)({
  marginBottom: 15,
});

const LoginPage = () => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "");
    const cpfDigits = digits.slice(0, 11);
    let formattedCPF = "";

    if (cpfDigits.length > 0) {
      formattedCPF = cpfDigits.slice(0, 3);

      if (cpfDigits.length > 3) {
        formattedCPF += "." + cpfDigits.slice(3, 6);
      }

      if (cpfDigits.length > 6) {
        formattedCPF += "." + cpfDigits.slice(6, 9);
      }

      if (cpfDigits.length > 9) {
        formattedCPF += "-" + cpfDigits.slice(9, 11);
      }
    }

    return formattedCPF;
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const cpfClean = cpf.replace(/\D/g, "");

    const user = {
      cpf: cpfClean,
      senha,
    };

    try {
      const response = await login(user);

      const token = response.data.token;
      localStorage.setItem("access_token", token);

      const roles = response.data.role;

      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("USER")) {
        navigate("/paciente");
      } else {
        setError("Acesso não autorizado.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Root>
      <PaperWrapper>
        <Title variant="h5">Login</Title>
        <form onSubmit={handleLogin}>
          <TextField
            label="CPF"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={cpf}
            onChange={handleCPFChange}
            inputProps={{ maxLength: 14 }}
            placeholder="123.456.789-12"
            required
          />
          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"} // Alterna o tipo entre texto e senha
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Entrar
          </Button>
        </form>
        <Typography sx={{ marginTop: 2 }}>
          Ainda não tem uma conta?
          <Link href="/register" variant="body2" sx={{ marginLeft: 0.5 }}>
            Registre-se!
          </Link>
        </Typography>
      </PaperWrapper>
    </Root>
  );
};

export default LoginPage;
