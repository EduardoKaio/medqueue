import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import Box from '@mui/material/Box';

const TamanhoMedioFilas = ({ value, sx }) => {
  // valor de 0 a 100 para a barra
  const progressValue = Math.min((value / 20) * 100, 100); // Supondo que 20 é o limite razoável de pessoas por fila

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
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={4}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Tamanho Médio das Filas
              </Typography>
              <Typography variant="h4">{value.toFixed(1)} pessoas</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#8e44ad', height: 60, width: 60 }}>
              <ListBulletsIcon size={28} color="#FFFFFF" />
            </Avatar>
          </Stack>
          <Box pt={1.5}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 5,
                borderRadius: 5,
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TamanhoMedioFilas;
