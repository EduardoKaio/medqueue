// Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { drawerWidth, drawerWidthClosed } from "./HeaderLayout";

const Sidebar = ({ open, setOpen, menuItems }) => {
  const location = useLocation();

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
            zIndex: (theme) => theme.zIndex.drawer + 1,
            mt: "64px",
          },
        }}
      >
        <List sx={{ padding: "0" }}>

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
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
