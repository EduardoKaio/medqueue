import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Toolbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewModule,
  TableChart,
  History as HistoryIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  getPacientes,
  deletePaciente,
} from "../../services/GerenciamentoPacienteService";

function PacienteList() {
  const [pacientes, setPacientes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPacientes = () => {
    getPacientes()
      .then((res) => setPacientes(res.data))
      .catch((err) => {
        console.error("Erro ao buscar pacientes:", err);
        setSnackbar({
          open: true,
          message: "Erro ao buscar pacientes.",
          severity: "error",
        });
      });
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleDelete = (id) => {
    deletePaciente(id)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Paciente excluído com sucesso!",
          severity: "success",
        });
        fetchPacientes();
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Erro ao excluir paciente:", err);
        setSnackbar({
          open: true,
          message: "Erro ao excluir paciente.",
          severity: "error",
        });
      });
  };
  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />

        <Container maxWidth="lg">
          {/* Título e Ações */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Pacientes
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: { xs: 2, md: 0 },
              }}
            >
              <IconButton color="primary" onClick={() => setViewMode("cards")}>
                <ViewModule />
              </IconButton>
              <IconButton color="primary" onClick={() => setViewMode("table")}>
                <TableChart />
              </IconButton>
              <Link to="/admin/pacientes/create">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: "#1976d2", ml: 2 }}
                >
                  Adicionar Paciente
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Campo de busca */}
          <TextField
            label="Pesquisar por nome ou CPF"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Tabela ou Cards */}
          {viewMode === "table" ? (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, boxShadow: 3 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Nome
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      CPF
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Telefone
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pacientesFiltrados.map((p, index) => (
                    <TableRow
                      key={p.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <TableCell>{p.nome}</TableCell>
                      <TableCell>{p.cpf}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.telefone}</TableCell>
                      <TableCell align="center">
                        
                        <Link to={`/admin/pacientes/edit/${p.id}`}>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <Link to={`/admin/pacientes/historico/${p.id}`}>
                          <IconButton color="gray">
                            <HistoryIcon />
                          </IconButton>
                        </Link>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setPacienteSelecionado(p);
                            setOpenDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={3}>
              {pacientesFiltrados.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {p.nome}
                      </Typography>
                      <Typography variant="body2">CPF: {p.cpf}</Typography>
                      <Typography variant="body2">Email: {p.email}</Typography>
                      <Typography variant="body2">
                        Telefone: {p.telefone}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Link to={`/admin/pacientes/edit/${p.id}`}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setPacienteSelecionado(p);
                          setOpenDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Modal de confirmação */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Deseja realmente excluir o paciente{" "}
          <strong>{pacienteSelecionado?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(pacienteSelecionado.id)}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PacienteList;
