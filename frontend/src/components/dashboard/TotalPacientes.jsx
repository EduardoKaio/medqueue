import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { Heartbeat as HeartbeatIcon } from '@phosphor-icons/react/dist/ssr/Heartbeat'; // Ícone sugestivo para pacientes

const TotalPacientes = ({ diff, trend, sx, value }) => {
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown;
  const trendColor = trend === 'up' ? '#00B894' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={{
        borderRadius: '20px', // ou '2xl' se estiver usando Tailwind como referência
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        width:'22rem',
        height:'11rem',
        ...sx, // preserva os estilos externos passados via prop
      }}>
      <CardContent>
        <Stack spacing={2} padding={2} >
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={5}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Pacientes Registrados
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#00B894', height: 60, width: 60 }}>
            <HeartbeatIcon size={28} color="#FFFFFF" />
            </Avatar>
          </Stack>
          {diff !== undefined && (
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Desde o último mês
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TotalPacientes;
