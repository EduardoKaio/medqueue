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
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import {
  getAnimalsByDono,
  deleteAnimal,
} from "../../services/AnimalService";
import { getCurrentUser } from "../../services/PacienteService";

function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [donoId, setDonoId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAnimals = (donoId) => {
    getAnimalsByDono(donoId)
      .then((res) => setAnimals(res.data))
      console.log(res.data)
      .catch((err) => {
        console.error("Erro ao buscar animais:", err);
        setSnackbar({
          open: true,
          message: "Erro ao buscar animais.",
          severity: "error",
        });
      });
  };

  useEffect(() => {
    // Primeiro pega o usuário atual para saber o donoId
    getCurrentUser()
      .then((res) => {
        const userId = res.data.id;
        setDonoId(userId);
        fetchAnimals(userId);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário atual:", err);
        setSnackbar({
          open: true,
          message: "Erro ao buscar dono.",
          severity: "error",
        });
      });
  }, []);

  const handleDelete = (id) => {
    deleteAnimal(id)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Animal excluído com sucesso!",
          severity: "success",
        });
        fetchAnimals(donoId);
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Erro ao excluir animal:", err);
        setSnackbar({
          open: true,
          message: "Erro ao excluir animal.",
          severity: "error",
        });
      });
  };

  const animalsFiltrados = animals.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.raca?.toLowerCase().includes(searchTerm.toLowerCase())
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
              Meus Animais
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
              <Link to="/paciente/animais/create">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: "#1976d2", ml: 2 }}
                >
                  Adicionar Animal
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Campo de busca */}
          <TextField
            label="Pesquisar por nome ou raça"
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
                      Raça
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Idade
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
                  {animalsFiltrados.map((a, index) => (
                    <TableRow
                      key={a.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <TableCell>{a.nome}</TableCell>
                      <TableCell>{a.raca}</TableCell>
                      <TableCell>{a.idade}</TableCell>
                      <TableCell align="center">
                        <Link to={`/paciente/animais/edit/${a.id}`}>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setAnimalSelecionado(a);
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
              {animalsFiltrados.map((a) => (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {a.nome}
                      </Typography>
                      <Typography variant="body2">Raça: {a.raca}</Typography>
                      <Typography variant="body2">Idade: {a.idade}</Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Link to={`/paciente/animais/edit/${a.id}`}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setAnimalSelecionado(a);
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
          Deseja realmente excluir o animal{" "}
          <strong>{animalSelecionado?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(animalSelecionado.id)}
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

export default AnimalList;
