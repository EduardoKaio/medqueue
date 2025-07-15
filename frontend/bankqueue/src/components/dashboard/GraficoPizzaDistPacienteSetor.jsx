"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Chart } from "./Chart";

export default function GraficoPizzaDistPacienteSetor({
  data = [],
  labels = [],
  sx,
}) {
  const theme = useTheme();

  const hasData = data && data.length > 0 && data.some((val) => val > 0);

  const chartOptions = {
    chart: { background: "transparent" },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: "none" } },
      hover: { filter: { type: "none" } },
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };

  return (
    <Card
      sx={{
        width: "31rem",
        height: "36rem",
        p: 2,
        borderRadius: "20px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        ...sx,
      }}
    >
      <CardHeader title="Clientes por Serviço" sx={{ pb: 2 }} />
      <CardContent sx={{ p: 2 }}>
        <Stack
          spacing={5}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          {hasData ? (
            <>
              <Chart
                height={450}
                options={chartOptions}
                series={data}
                type="donut"
                width="100%"
              />
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {labels.map((label, index) => (
                  <Stack
                    key={label}
                    spacing={0.5}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography variant="h6">{label}</Typography>
                    <Typography color="text.secondary" variant="subtitle2">
                      {(
                        (data[index] / data.reduce((a, b) => a + b, 0)) *
                        100
                      ).toFixed(0)}
                      %
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          ) : (
            <Typography variant="subtitle1" color="text.secondary">
              Não há clientes em nenhuma fila no momento.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
