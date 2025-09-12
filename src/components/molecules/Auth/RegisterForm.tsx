"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import {
  Visibility as VisibilityOnIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Register } from "../../../locales/register";
import FormProvider from "../../../shared/Hook-form/FormProvider";
import RHFTextField from "../../../shared/Hook-form/RHFTextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { registerUser } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { dispatch } from "@/app/redux/store";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required(
      Register.validationMessage.firstNameRequired
    ),
    lastName: Yup.string().required(
      Register.validationMessage.lastNameRequired
    ),
    email: Yup.string()
      .required(Register.validationMessage.emailRequired)
      .email(),
    password: Yup.string()
      .required(Register.validationMessage.passwordRequired)
      .min(6),
  });

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: RegisterFormValues) => {
    const response = await dispatch(
      registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
    );
    if (registerUser.fulfilled.match(response)) {
      // navigate to login page
      router.push("/login");
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Typography variant="h5">{Register.title}</Typography>
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
            label={Register.firstName}
            placeholder={Register.placeholder.firstName}
            name="firstName"
          />
          <RHFTextField
            label={Register.lastName}
            placeholder={Register.placeholder.lastName}
            name="lastName"
          />
          <RHFTextField
            label={Register.emailLabel}
            placeholder={Register.placeholder.email}
            name="email"
          />
          <RHFTextField
            label={Register.passwordLabel}
            placeholder={Register.placeholder.password}
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
          <Button
            data-testid="register-button"
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {Register.registerButton}
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {Register.haveAccount}{" "}
            <Link href="/login">{Register.login}</Link>
          </Typography>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default RegisterForm;
