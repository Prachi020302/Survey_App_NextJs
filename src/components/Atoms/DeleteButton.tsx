import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const DeleteButton = ({
  dataTestId,
  onClick,
}: {
  dataTestId?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <IconButton
      data-testid={dataTestId}
      onClick={(e) => {
        onClick(e); // Pass the event to the handler
      }}
      color="error"
    >
      <Delete />
    </IconButton>
  );
};

export default DeleteButton;
