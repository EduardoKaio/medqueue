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
  backgroundColor: "#f4f6f8",
});

const PaperWrapper = styled(Paper)({
  padding: 32,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
});

const Title = styled(Typography)({
  marginBottom: 24,
});

const LoginPage = () => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const user = {
        cpf,
        senha
    }

    try {
      const response = await login(user);

      const token = response.data.token;

      localStorage.setItem("access_token", token);

      const roles = response.data.role;

      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("USER")) {
        navigate("/");
      } else {
        setError("Acesso não autorizado.");
      }

    } catch (err) {
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
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            label="CPF"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type={showPassword ? "text" : "Senha"} // Alterna o tipo entre texto e senha
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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

       <Link href="/register" variant="body2" sx={{ marginTop: 2 }}>
          Registre-se agora!
        </Link>
      </PaperWrapper>
    </Root>
  );
};

export default LoginPage;