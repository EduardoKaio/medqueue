import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getCurrentUser } from "../services/PacienteService";

import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  FormatListNumbered as QueueIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";

export const drawerWidth = 240;
export const drawerWidthClosed = 60;

const HeaderLayout = () => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);

  const location = useLocation();

  const pathname = location.pathname;

  const getTitle = () => {
    if (pathname.startsWith("/admin/dashboard"))
      return "Administração da Clínica";
    if (pathname.startsWith("/admin/pacientes/create")) return "Criar Paciente";
    if (pathname.startsWith("/admin/pacientes/edit")) return "Editar Paciente";
    if (pathname.startsWith("/admin/pacientes")) return "Pacientes";
    if (pathname.startsWith("/admin/filas/create")) return "Criar Fila";
    if (pathname.startsWith("/admin/filas/")) return "Fila Detalhada";
    if (pathname.startsWith("/admin/filas")) return "Filas";

    if (pathname.startsWith("/paciente/triagem")) return "Triagem Inteligente";
    if (pathname.startsWith("/paciente")) return "Área do Paciente";

    return "MedQueue";
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await getCurrentUser();
          setUser(response.data);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const adminMenu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon color="primary" />,
    },
    {
      label: "Pacientes",
      path: "/admin/pacientes",
      icon: <PersonIcon color="primary" />,
    },
    {
      label: "Filas",
      path: "/admin/filas",
      icon: <PeopleAltIcon color="primary" />,
    },
  ];

  const pacienteMenu = [
    {
      label: "Início",
      path: "/paciente",
      icon: <HomeIcon color="primary" />,
    },
    {
      label: "Triagem Inteligente",
      path: "/paciente/triagem",
      icon: <AssignmentIcon color="primary" />,
    },
    {
      label: "Fila Atual",
      path: "/paciente/fila-atual",

      icon: <QueueIcon color="primary" />,
    },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "ROLE_ADMIN":
        return adminMenu;
      case "ROLE_USER":
        return pacienteMenu;
      default:
        return [];
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header open={open} user={user} title={getTitle()} />
      <Sidebar open={open} setOpen={setOpen} menuItems={getMenuItems()} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${open ? drawerWidth : drawerWidthClosed}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default HeaderLayout;
