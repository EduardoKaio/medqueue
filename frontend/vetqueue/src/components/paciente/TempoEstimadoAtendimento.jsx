import React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { Hourglass as HourglassIcon } from '@phosphor-icons/react/dist/ssr/Hourglass';

const TempoEstimadoAtendimento = ({ tempo, sx }) => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '28rem',
        ...sx,
      }}
    >
      <CardContent>
        <Stack spacing={2} padding={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={5}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Tempo Estimado para Atendimento
              </Typography>
              <Typography variant="h4">{tempo} minutos</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#9b59b6', height: 60, width: 60 }}>
              <HourglassIcon size={28} color="#FFFFFF" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TempoEstimadoAtendimento;
