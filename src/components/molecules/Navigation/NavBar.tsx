"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LoginState } from "@/app/redux/selector/auth";
import { authActions } from "@/app/redux/slices/authSlice";
import SideMenu from "./SideMenu";

const NavBar = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const loginState = useSelector(LoginState);

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authActions.setLogout());
    router.push("/login");
    handleMenuClose();
  };

  const handleProfile = () => {
    // Navigate to profile page (to be implemented)
    router.push("/profile");
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            data-testid="menu-button"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSideMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Survey Management System
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Notifications */}
            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            {/* User Menu */}
            <IconButton
              data-testid="user-menu-button"
              size="large"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                data-testid="user-profile-menu-item"
                onClick={handleProfile}
              >
                <PersonIcon sx={{ mr: 1 }} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle2">Profile</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loginState.email} ({loginState.role})
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <SideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        variant="temporary"
      />
    </>
  );
};

export default NavBar;
