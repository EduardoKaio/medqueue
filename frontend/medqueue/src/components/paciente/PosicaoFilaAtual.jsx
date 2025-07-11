import React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { UsersThree as UsersIcon } from '@phosphor-icons/react/dist/ssr/UsersThree';

const PosicaoFilaAtual = ({ posicao, sx }) => {
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
                Sua Posição na Fila
              </Typography>
              <Typography variant="h4">{posicao}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#3498db', height: 60, width: 60 }}>
              <UsersIcon size={28} color="#FFFFFF" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PosicaoFilaAtual;
