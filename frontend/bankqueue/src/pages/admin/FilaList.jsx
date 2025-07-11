import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { listarTodas, deletarFila, criarFilaGeralDoDia } from "../../services/FilaService";

import VisibilityIcon from '@mui/icons-material/Visibility';

function FilaList() {
  const location = useLocation();
  const [filas, setFilas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filaSelecionada, setFilaSelecionada] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFilas = () => {
    listarTodas()
      .then((res) => setFilas(res.data))
      .catch((err) => {
        console.error("Erro ao buscar filas:", err);
        setSnackbar({
          open: true,
          message: "Erro ao buscar filas.",
          severity: "error",
        });
      });
  };

  useEffect(() => {
    fetchFilas();
    if (location.state && location.state.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || "success",
      });

      window.history.replaceState({}, document.title);
    }
    
  }, [location]);

  const handleDelete = (id) => {
    deletarFila(id)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Fila excluída com sucesso!",
          severity: "success",
        });
        fetchFilas();
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Erro ao excluir fila:", err);
        setSnackbar({
          open: true,
          message: "Erro ao excluir fila.",
          severity: "error",
        });
      });
  };

  const filasFiltradas = filas.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlecriarFilaGeralDoDia = async (e) => {
    e.preventDefault();

    try {
      await criarFilaGeralDoDia();
      setSnackbar({
        open: true,
        message: "Fila geral do dia criada com sucesso!",
        severity: "success",
      });
      fetchFilas();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Fila geral do dia já existe!",
        severity: "error",
      });
      console.log(error)
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
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
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#FF8F00" }}
            >
              Filas
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: { xs: 2, md: 0 },
              }}
            >
              <IconButton sx={{ color: '#FF8F00' }} onClick={() => setViewMode("cards")}>
                <ViewModule />
              </IconButton>
              <IconButton sx={{ color: '#FF8F00' }} onClick={() => setViewMode("table")}>
                <TableChart />
              </IconButton>
              <Link to="/admin/filas/create">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: "#FF8F00", ml: 2 }}
                >
                  Adicionar Fila
                </Button>
              </Link>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: "#FF8F00", ml: 2 }}
                onClick={(e) => handlecriarFilaGeralDoDia(e)}
              >
                Criar fila geral
              </Button>
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
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, boxShadow: 3 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#FF8F00" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Nome
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Descrição
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Tempo Médio
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Especialidade
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Data de Criação
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
                  {filasFiltradas.map((f, index) => (
                    <TableRow
                      key={f.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                      }}
                    >
                      <TableCell>{f.nome}</TableCell>
                      <TableCell>{f.descricao}</TableCell>
                      
                      <TableCell>{f.tempoMedio} min</TableCell>
                      <TableCell>{f.especialidade}</TableCell>
                      <TableCell>{f.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('pt-BR').format(new Date(f.dataCriacao + 'T12:00:00'))}
                      </TableCell>
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
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
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
                      <>
                        <Typography variant="h6" gutterBottom>
                          {f.nome}
                        </Typography>
                    
                        <Typography variant="body2">
                          Descrição: {f.descricao}
                        </Typography>
                        
                        <Typography variant="body2">
                          Tempo Médio: {f.tempoMedio} min
                        </Typography>
                        <Typography variant="body2">
                          Descrição: {f.descricao}
                        </Typography>
                        <Typography variant="body2">
                          Tempo Médio: {f.tempoMedio} min
                        </Typography>
                      </>
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
          Deseja realmente excluir a fila{" "}
          <strong>{filaSelecionada?.nome}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(filaSelecionada.id)}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

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

export default FilaList;
