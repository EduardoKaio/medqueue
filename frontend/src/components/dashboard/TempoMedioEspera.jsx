import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';

const TempoMedioEspera = ({ tempoMedio, sx }) => {
  return (
    <Card sx={{
      borderRadius: '20px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      width: '22rem',
      height:'11rem',
      ...sx,
    }}>
      <CardContent>
        <Stack spacing={2} padding={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={5}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Tempo Médio de Espera
              </Typography>
              <Typography variant="h4">{tempoMedio} minutos</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#f39c12', height: 60, width: 60 }}>
              <ClockIcon size={28} color="#FFFFFF" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TempoMedioEspera;
