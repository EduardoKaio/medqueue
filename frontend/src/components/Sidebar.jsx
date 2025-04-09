import React, { useState } from "react";
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
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  LocalHospital as LocalHospitalIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importa o useNavigate

const drawerWidth = 240;
const drawerWidthClosed = 60;

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation(); // Para verificar a página atual e destacar no menu
  const navigate = useNavigate(); // Hook de navegação do react-router

  // Função para realizar o logout
  const handleLogout = () => {
    // Remove o token do localStorage (ou sessionStorage)
    localStorage.removeItem("access_token");

    // Redireciona para a página de login
    navigate("/login");
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
          {/* Botão do menu */}
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Menu" />}
          </ListItemButton>

          <Divider />

          {/* Links de navegação */}
          <ListItemButton
            component={Link}
            to="/admin/dashboard"
            selected={location.pathname === "/admin/dashboard"}
          >
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        
          <ListItemButton
            component={Link}
            to="/admin/pacientes"
            selected={location.pathname === "/admin/pacientes"}
          >
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            {open && <ListItemText primary="Pacientes" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/admin/filas"
            selected={location.pathname === "/admin/filas"}
          >
            <ListItemIcon>
              <PeopleAltIcon color="primary" />
            </ListItemIcon>
            {open && <ListItemText primary="Filas" />}
          </ListItemButton>

          <Divider />

          {/* Botão de Sair */}
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
