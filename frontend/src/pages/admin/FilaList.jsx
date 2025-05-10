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
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
  ViewModule,
  TableChart,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import Header from "../../components/Header";
import { drawerWidth, drawerWidthClosed } from "../../components/Sidebar";
import { listarTodas, deletarFila } from "../../services/FilaService";

function FilaList() {
  const [open, setOpen] = useState(true);
  const [filas, setFilas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filaSelecionada, setFilaSelecionada] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon color="primary" /> },
    { label: "Pacientes", path: "/admin/pacientes", icon: <PersonIcon color="primary" /> },
    { label: "Filas", path: "/admin/filas", icon: <PeopleAltIcon color="primary" /> },
  ];

  const fetchFilas = () => {
    listarTodas()
      .then((res) => setFilas(res.data))
      .catch((err) => {
        console.error("Erro ao buscar filas:", err);
        setSnackbar({ open: true, message: "Erro ao buscar filas.", severity: "error" });
      });
  };

  useEffect(() => {
    fetchFilas();
  }, []);

  const handleDelete = (id) => {
    deletarFila(id)
      .then(() => {
        setSnackbar({ open: true, message: "Fila excluída com sucesso!", severity: "success" });
        fetchFilas();
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Erro ao excluir fila:", err);
        setSnackbar({ open: true, message: "Erro ao excluir fila.", severity: "error" });
      });
  };

  const filasFiltradas = filas.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} menuItems={adminMenu} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Header open={open} drawerWidth={drawerWidth} drawerWidthClosed={drawerWidthClosed} />
        <Toolbar />

        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Filas
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 2, md: 0 } }}>
              <IconButton color="primary" onClick={() => setViewMode("cards")}>
                <ViewModule />
              </IconButton>
              <IconButton color="primary" onClick={() => setViewMode("table")}>
                <TableChart />
              </IconButton>
              <Link to="/admin/filas/create">
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#1976d2", ml: 2 }}>
                  Adicionar Fila
                </Button>
              </Link>
            </Box>
          </Box>

          <TextField
            label="Pesquisar por nome"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {viewMode === "table" ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
<<<<<<< Updated upstream
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nome</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descrição</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prioridade</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tempo Médio</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Ações</TableCell>
=======
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Nome
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Descrição
                    </TableCell>
                   
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Tempo Médio
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
>>>>>>> Stashed changes
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filasFiltradas.map((f, index) => (
                    <TableRow
                      key={f.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <TableCell>{f.id}</TableCell>
                      <TableCell>{f.nome}</TableCell>
                      <TableCell>{f.descricao}</TableCell>
                      
                      <TableCell>{f.tempoMedio} min</TableCell>
                      <TableCell align="center">
                        <Link to={`/admin/filas/edit/${f.id}`}>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setFilaSelecionada(f);
                            setOpenDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Link to={`/admin/filas/${f.id}`}>
                            <Button variant="outlined">Ver pacientes</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid container spacing={3}>
              {filasFiltradas.map((f) => (
                <Grid item xs={12} sm={6} md={4} key={f.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {f.nome}
                      </Typography>
<<<<<<< Updated upstream
                      <Typography variant="body2">Descrição: {f.descricao}</Typography>
                      <Typography variant="body2">Prioridade: {f.prioridade}</Typography>
                      <Typography variant="body2">Tempo Médio: {f.tempoMedio} min</Typography>
=======
                      <Typography variant="body2">
                        Descrição: {f.descricao}
                      </Typography>
                      
                      <Typography variant="body2">
                        Tempo Médio: {f.tempoMedio} min
                      </Typography>
>>>>>>> Stashed changes
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Link to={`/admin/filas/edit/${f.id}`}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setFilaSelecionada(f);
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Deseja realmente excluir a fila <strong>{filaSelecionada?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(filaSelecionada.id)} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FilaList;
