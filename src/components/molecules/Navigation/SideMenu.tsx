"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PostAdd as AddSurveyIcon,
  FormatListBulleted as ResponseListIcon,
  Poll as SurveysIcon,
  // AddCircleOutline as AddResponseIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LoginState } from "@/app/redux/selector/auth";
import { authActions } from "@/app/redux/slices/authSlice";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  dataTestId: string;
}

const menuItems: MenuItem[] = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["Admin"],
    dataTestId: "dashboard",
  },
  {
    text: "Add Survey",
    icon: <AddSurveyIcon />,
    path: "/addSurvey",
    roles: ["Admin"],
    dataTestId: "add-survey",
  },
  {
    text: "Surveys",
    icon: <SurveysIcon />,
    path: "/surveys",
    roles: ["Admin", "User"],
    dataTestId: "surveys",
  },
  {
    text: "Response List",
    icon: <ResponseListIcon />,
    path: "/responses",
    roles: ["Admin"],
    dataTestId: "response-list",
  },

  {
    text: "My Responses",
    icon: <ResponseListIcon />,
    path: "/my-responses",
    roles: ["User"],
    dataTestId: "my-responses",
  },
  // {
  //   text: "Add Response",
  //   icon: <AddResponseIcon />,
  //   path: "/add-response",
  //   roles: ["User"],
  // },
];

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
  variant?: "temporary" | "persistent" | "permanent";
}

const SideMenu = ({
  open,
  onClose,
  drawerWidth = 280,
  variant = "temporary",
}: SideMenuProps) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const loginState = useSelector(LoginState);
  const userRole = loginState.role;

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleMenuClick = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    dispatch(authActions.setLogout());
    router.push("/login");
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h6" noWrap>
          Survey App
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {userRole === "Admin" ? "Admin Panel" : "User Dashboard"}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ pt: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              data-testid={item.dataTestId}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.primary.main,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Spacer to push logout to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* User Info and Logout */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Logged in as:
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          {loginState.email}
        </Typography>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            "&:hover": {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          top: { xs: "56px", sm: "64px" }, // Different heights for mobile vs desktop AppBar
          height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" }, // Adjust accordingly
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideMenu;
