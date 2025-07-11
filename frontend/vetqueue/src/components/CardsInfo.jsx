import React from "react";
import { Card, Avatar, Typography, Box, Stack } from "@mui/material";

const CardsInfo = ({
  icon,
  iconColor,
  title,
  value,
  description,
  descriptionColor,
  children,
}) => (
  <Card sx={{ minHeight: 140, height: "100%", display: "flex", alignItems: "center", px: 2, width: "22rem" }}>
    <Stack direction="row" alignItems="center" spacing={2} width="100%">
      <Avatar sx={{ bgcolor: iconColor, width: 56, height: 56 }}>
        {icon}
      </Avatar>
      <Box flex={1}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color={descriptionColor || "text.secondary"} sx={{ fontWeight: 600 }}>
            {description}
          </Typography>
        )}
        {children}
      </Box>
    </Stack>
  </Card>
);

export default CardsInfo;
