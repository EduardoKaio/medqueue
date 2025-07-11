'use client';

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Chart } from './Chart';

/**
 * @param {{ chartSeries: { name: string, data: number[] }[], categories: string[], sx?: object }} props 
 */
function GraficoEsperaPorSetor({ chartSeries, categories, sx = {} }) {
  const theme = useTheme();
  const [chartKey, setChartKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    // Aqui você pode emitir um evento para o componente pai buscar dados novamente (se for o caso)
    setTimeout(() => {
      setChartKey(prev => prev + 1); // força re-renderização
      setLoading(false);
    }, 500); // Simula um curto tempo de atualização visual
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 300 },
      },
    },
    colors: ['#8e44ad', 'rgba(142, 68, 173, 0.3)'],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px', distributed: false } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      categories,
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value} min`,
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };

  return (
    <Card
      sx={{
        width: '60rem',
        height: '36rem',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        ...sx,
      }}
    >
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Atualizar
          </Button>
        }
        title="Análise das Filas"
        subheader="Tempo médio de espera por especialidade"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Chart
          key={chartKey}
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Ver detalhes
        </Button>
      </CardActions>
    </Card>
  );
}

export default GraficoEsperaPorSetor;
