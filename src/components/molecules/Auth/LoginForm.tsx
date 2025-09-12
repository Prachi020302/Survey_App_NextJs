"use client";

import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as VisibilityOnIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Login } from "../../../locales/login";
import FormProvider from "../../../shared/Hook-form/FormProvider";
import { useForm } from "react-hook-form";
import RHFTextField from "../../../shared/Hook-form/RHFTextField";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/app/redux/slices/authSlice";
import { dispatch } from "@/app/redux/store";
import { ENUM_USER } from "@/Backend/types/User";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string().required(Login.validationMessage.emailRequired).email(),
    password: Yup.string()
      .required(Login.validationMessage.passwordRequired)
      .min(6),
  });

  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: LoginFormValues) => {
    const response = await dispatch(
      loginUser({
        email: data.email,
        password: data.password,
      })
    );

    if (loginUser.fulfilled.match(response)) {
      if (response.payload.data.role === ENUM_USER.ADMIN) {
        router.push("/dashboard");
      } else {
        router.push("/surveys");
      }
    }
  };

  return (
    <Box
      sx={{
        mt: 8,
        textAlign: "center",
      }}
    >
      <Typography variant="h5">{Login.loginTitle}</Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <RHFTextField
            label={Login.emailLabel}
            placeholder={Login.placeHolder.email}
            name="email"
          />
          <RHFTextField
            label={Login.passwordLabel}
            placeholder={Login.placeHolder.password}
            name="password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              sx: { width: "300px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityOnIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            <Link href="/forget-password">Forget Password?</Link>
          </Typography>
          <Button
            data-testid="login-button"
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {Login.loginButton}
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {Login.notHaveAccount}{" "}
            <Link data-testid="register-link" href="/register">
              {Login.registerNow}
            </Link>
          </Typography>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default LoginForm;
