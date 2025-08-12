import { Menu, MenuItem } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { FC } from "react";

interface UserContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserContextMenu: FC<UserContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={onEdit}>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        Edit
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
        Delete
      </MenuItem>
    </Menu>
  );
};