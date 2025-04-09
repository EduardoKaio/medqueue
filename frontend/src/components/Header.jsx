import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = ({ open, drawerWidth, drawerWidthClosed }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'margin-left 0.3s, width 0.3s',
        width: `calc(100% - ${open ? drawerWidth : drawerWidthClosed}px)`,
        ml: `${open ? drawerWidth : drawerWidthClosed}px`,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Administração da Clínica
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
