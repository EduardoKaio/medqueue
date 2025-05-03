import React, { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  Paper,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Função para realizar o logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleOpenMenu} size="small">
        <Avatar src={user?.photoUrl} alt={user?.nome} sx={{ width: 40, height: 40 }}>
          {user?.nome ? user.nome.charAt(0) : ""}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          component: Paper,
          elevation: 4,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            width: 240,
            overflow: "visible",
            filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 16,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, textAlign: "center", bgcolor: "primary.main", color: "white", borderRadius: "8px 8px 0 0" }}>
          <Avatar src={user?.photoUrl} alt={user?.nome} sx={{ width: 56, height: 56, mx: "auto", mb: 1 }} />
          <Typography variant="subtitle1">{user?.nome || "Usuário"}</Typography>
          <Typography variant="body2">{user?.email || "email@exemplo.com"}</Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.8 }}>
            {
              user?.role.includes("ADMIN") 
                ? "administrador" 
                : user?.role.includes("USER")
                ? "Paciente"
                : "Usuário"
            }
          </Typography>
        </Box>

        <MenuItem onClick={handleLogout} sx={{ px: 2, py: 1.5, color: "error.main" }}>
          <ListItemIcon>
            <Logout fontSize="medium" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <Typography variant="body1">Sair</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;