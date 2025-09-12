import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type RHFTextFieldProps = TextFieldProps & {
  name: string;
  placeholder?: string;
  label: string;
};

const RHFTextField = ({ name, label, ...rest }: RHFTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          data-testid={name}
          sx={{
            "& .MuiInputBase-input": {
              borderRadius: "8px",
            },
            "& .MuiInputBase-input::placeholder": {
              textTransform: "none",
            },
          }}
          margin="dense"
          fullWidth
          label={label}
          {...field}
          {...rest}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default RHFTextField;
