// Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, Link } from "react-router-dom";

const drawerWidth = 240;
const drawerWidthClosed = 60;

const Sidebar = ({ open, setOpen, menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : drawerWidthClosed,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : drawerWidthClosed,
            transition: "width 0.3s ease",
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        <List>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Menu" />}
          </ListItemButton>

          <Divider />

          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}

          <Divider />

          <ListItemButton sx={{ color: "error.main" }} onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon color="error" />
            </ListItemIcon>
            {open && <ListItemText primary="Sair" />}
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export { Sidebar, drawerWidth, drawerWidthClosed };
