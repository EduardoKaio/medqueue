import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { drawerWidth, drawerWidthClosed } from "./HeaderLayout";
import UserMenu from "./UserMenu";

const Header = ({ open, user, title }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: "margin-left 0.3s, width 0.3s",
        width: "100%",
        ml: `${open ? drawerWidth : drawerWidthClosed}px`,
      }}
    >
      <Toolbar>
        {/* Área de usuário: avatar com menu */}

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Box>

        <UserMenu user={user} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
