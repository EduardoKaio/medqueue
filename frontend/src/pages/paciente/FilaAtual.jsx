import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Alert, Stack } from "@mui/material";
import { getQueueInfo } from "../../services/PacienteService";
import PosicaoFilaAtual from "../../components/paciente/PosicaoFilaAtual";
import TempoEstimadoAtendimento from "../../components/paciente/TempoEstimadoAtendimento";

function FilaAtual() {
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        const response = await getQueueInfo();
        setQueueInfo(response.data);
      } catch (err) {
        console.error("Erro ao buscar informações da fila:", err);
        setError("Não foi possível carregar as informações da fila.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueueInfo();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress />
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

  // Verifica se o backend retornou uma mensagem indicando que o paciente não está em nenhuma fila
 if (queueInfo?.mensagem) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Alert severity="info">
        Você não está em nenhuma fila no momento.
      </Alert>
    </Box>
  );
}

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 12, px: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", maxWidth: "1200px" }}
      >
        <PosicaoFilaAtual posicao={queueInfo.posicao} sx={{ width: "100%" }} />
        <TempoEstimadoAtendimento tempo={queueInfo.tempoEstimado} sx={{ width: "100%" }} />
      </Stack>
    </Box>
  );
}

export default FilaAtual;
