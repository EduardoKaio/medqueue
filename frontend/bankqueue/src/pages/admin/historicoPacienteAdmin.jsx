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
  Button,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { getHistoricoPacienteAdmin } from "../../services/FilaPacienteService"; 

function HistoricoPacienteAdmin() {
  const { id } = useParams(); // pega o id do paciente da URL
  const navigate = useNavigate();
  const [nomePaciente, setNomePaciente] = useState("");
  const [historicoFilas, setHistoricoFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await getHistoricoPacienteAdmin(id);
        setNomePaciente(response.data.nomePaciente);
        setHistoricoFilas(response.data.historicoFilas);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        if (
          err.response?.status === 404 &&
          err.response?.data?.mensagem
        ) {
          setMensagem("Este cliente ainda não possui histórico de filas.");
        } else {
          setError("Não foi possível carregar o histórico");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [id]);

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
       <Box sx={{ mt: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent:"space-between" }}>
            
                <Link to="/admin/pacientes" style={{ textDecoration: "none", color: "inherit" }}>
                    <ArrowBackIcon color="primary" sx={{ fontSize: 30, ml: 2 }} />
                </Link>
                
            
            <Alert severity="info" sx={{ maxWidth: 500, width: "100%" }}>
            {mensagem}
            </Alert>
            <Typography></Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />

        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
             <Link to="/admin/pacientes" style={{ textDecoration: "none", color: "inherit" }}>
                    <ArrowBackIcon color="primary" sx={{ fontSize: 30 }} />
                </Link>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Histórico do Cliente
            </Typography>
            <Typography></Typography>
          </Box>
          <Typography ml={3} mb={2} display="flex" justifyContent="center"
              variant="h5"
              sx={{ fontWeight: "", color: "#1976d2" }}
            >
              {nomePaciente ? `${nomePaciente}` : ""}
            </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Fila ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nome da Fila
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Data de Entrada
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicoFilas.map((fila, index) => (
                  <TableRow
                    key={fila.filaId}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <TableCell>{fila.filaId}</TableCell>
                    <TableCell>{fila.nomeFila}</TableCell>
                    <TableCell>{fila.especialidade}</TableCell>
                    <TableCell>{fila.prioridade}</TableCell>
                    <TableCell>{fila.status}</TableCell>
                    <TableCell>{new Date(fila.dataEntrada).toLocaleString()}</TableCell>
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

export default HistoricoPacienteAdmin;
