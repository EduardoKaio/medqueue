'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Chart } from './Chart';

const setores = ['Oftalmologia', 'Cardiologia', 'Clínico Geral'];
const dados = [45, 30, 25]; 

export default function GraficoPizzaDistPacienteSetor({ sx }) {
  const theme = useTheme();

  const chartOptions = {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels: setores,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };

  return (
    <Card
      sx={{
        width:'31rem',    // largura
        height: '36rem',      // altura
        p: 2,             // padding externo do card
        borderRadius: '20px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
        ...sx             // permite sobrescrever via props
      }}
    >
      <CardHeader
        title="Pacientes por Especialidade"
        sx={{ pb: 2 }} // reduz espaço abaixo do header
      />
      <CardContent sx={{ p: 2 }}> {/* padding interno do conteúdo */}
        <Stack spacing={4}>
          <Chart height={350} options={chartOptions} series={dados} type="donut" width="100%" />
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {setores.map((setor, index) => (
              <Stack key={setor} spacing={0.5} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{setor}</Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {dados[index]}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
