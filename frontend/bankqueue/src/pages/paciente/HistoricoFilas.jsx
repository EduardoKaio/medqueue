import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
} from "@mui/material";
import { getHistoricoFilas } from "../../services/PacienteService";

function HistoricoFilas() {
  const [historicoFilas, setHistoricoFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensagem, setMensagem] = useState(null); // <-- nova mensagem informativa

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await getHistoricoFilas();
        setHistoricoFilas(response.data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);

        // Se for erro 404 com mensagem específica
        if (err.response?.status === 404 && err.response?.data?.mensagem) {
          setMensagem("Você não possui histórico de filas no momento.");
        } else {
          setError("Não foi possível carregar o histórico");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="textSecondary">
          Carregando histórico...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (mensagem) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Alert severity="info">{mensagem}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />

        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
          >
            Histórico de Filas
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Data de Entrada
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Especialidade
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Prioridade
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicoFilas.map((fila, index) => (
                  <TableRow
                    key={fila.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        opacity: 0.08,
                      },
                    }}
                  >
                    <TableCell>
                      {new Date(fila.dataEntrada).toLocaleString()}
                    </TableCell>
                    <TableCell>{fila.especialidade}</TableCell>
                    <TableCell>{fila.prioridade}</TableCell>
                    <TableCell>{fila.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}

export default HistoricoFilas;
