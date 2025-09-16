"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Layouts from "@/components/molecules/Layouts/Layouts";
import FormProvider from "@/shared/Hook-form/FormProvider";
import RHFTextField from "@/shared/Hook-form/RHFTextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup.js";
import { dispatch } from "../redux/store";
import { authActions, resetPassword } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Login } from "@/locales/login";
import * as Yup from "yup";

interface ResetPasswordFormValues {
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();

  const validateSchema = Yup.object().shape({
    token: Yup.string().required(
      Login.resetPassword.validationMessage.tokenRequired
    ),
    password: Yup.string()
      .required(Login.resetPassword.validationMessage.passwordRequired)
      .min(6, Login.resetPassword.validationMessage.passwordMinLength),
    confirmPassword: Yup.string()
      .required(Login.resetPassword.validationMessage.confirmPasswordRequired)
      .oneOf(
        [Yup.ref("password")],
        Login.resetPassword.validationMessage.passwordsMustMatch
      ),
  });

  const methods = useForm({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const response = await dispatch(
      resetPassword({
        token: data.token,
        password: data.password,
      })
    );
    if (resetPassword.fulfilled.match(response)) {
      toast.success("Password reset successful");
      setTimeout(() => router.push("/login"), 2000);
      dispatch(authActions.resetToken());
    } else {
      toast.error(response.payload?.message || "Error resetting password");
    }
  };

  return (
    <Layouts>
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">{Login.resetPassword.title}</Typography>
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
              label={Login.resetPassword.tokenLabel}
              {...methods.register("token", { required: true })}
              sx={{ mt: 2 }}
            />
            <RHFTextField
              label={Login.resetPassword.newPasswordLabel}
              type="password"
              {...methods.register("password", { required: true })}
              sx={{ mt: 2 }}
            />
            <RHFTextField
              label={Login.resetPassword.confirmPasswordLabel}
              {...methods.register("confirmPassword", { required: true })}
              sx={{ mt: 2 }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              {Login.resetPassword.title}
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Layouts>
  );
};

export default ResetPasswordPage;
