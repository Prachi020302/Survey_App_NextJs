"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Layouts from "@/components/molecules/Layouts/Layouts";
import FormProvider from "@/shared/Hook-form/FormProvider";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Login } from "@/locales/login";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "@/shared/Hook-form/RHFTextField";
import { dispatch } from "../redux/store";
import { generateResetToken } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";
import { AuthToken } from "../redux/selector/auth";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ForgetPasswordFormValues {
  email: string;
}

const ForgetPasswordPage = () => {
  const navigate = useRouter();
  const [copied, setCopied] = useState(false);

  const token = useSelector(AuthToken, shallowEqual);

  const validateSchema = Yup.object().shape({
    email: Yup.string().required(Login.validationMessage.emailRequired).email(),
  });

  const methods = useForm({
    resolver: yupResolver(validateSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ForgetPasswordFormValues) => {
    if (data.email) {
      const response = await dispatch(
        generateResetToken({ email: data.email })
      );
      if (generateResetToken.rejected.match(response)) {
        toast.error(response.payload?.message);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
  };

  const handleResetNavigate = () => {
    navigate.push("/reset-password");
  };

  return (
    <Layouts>
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">{Login.forgetPassword.title}</Typography>
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
              label="Email"
              {...methods.register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              sx={{ mt: 2 }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              {Login.forgetPassword.generateToken}
            </Button>

            {token && (
              <Box sx={{ mt: 4 }}>
                <Typography>{Login.forgetPassword.copyText}</Typography>
                <TextField
                  value={token}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopy} edge="end">
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mt: 2, width: "400px" }}
                />
                <Typography variant="body2" onClick={handleCopy} sx={{ mt: 2 }}>
                  {copied
                    ? Login.forgetPassword.copied
                    : Login.forgetPassword.copyToken}
                </Typography>
                <Button onClick={handleResetNavigate} sx={{ mt: 2 }}>
                  {Login.forgetPassword.resetButton}
                </Button>
              </Box>
            )}
          </Box>
        </FormProvider>
      </Box>
    </Layouts>
  );
};

export default ForgetPasswordPage;
