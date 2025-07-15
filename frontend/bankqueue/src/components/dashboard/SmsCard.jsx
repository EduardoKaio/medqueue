import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { Sms as SmsIcon, History as HistoryIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { getContadorSms } from "../../services/SmsService";

const SmsCard = () => {
  const [totalSms, setTotalSms] = useState(0);

  useEffect(() => {
    const fetchSmsCount = async () => {
      try {
        const response = await getContadorSms();
        setTotalSms(response.totalSmsEnviados);
      } catch (error) {
        console.error("Erro ao buscar contador de SMS:", error);
      }
    };

    fetchSmsCount();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        background: "linear-gradient(135deg, #FF8F00 0%, #FFA726 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <SmsIcon sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h6" fontWeight="bold">
          SMS Enviados
        </Typography>
      </Box>

      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ mb: 1, textAlign: "center" }}
      >
        {totalSms.toLocaleString("pt-BR")}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Total de notificações
        </Typography>
        <Link to="/admin/sms-historico" style={{ color: "inherit" }}>
          <IconButton
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Link>
      </Box>
    </Paper>
  );
};

export default SmsCard;
