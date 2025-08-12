import { Box, Typography, Avatar, Chip, IconButton, Tooltip } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { IUsers } from "../../providers/users";
import { Column } from "../table/component";

const getRoleColor = (role: string) => {
  switch (role) {
    case 'owner-doctor': return 'error';
    case 'doctor': return 'primary';
    case 'assistant': return 'secondary';
    case 'nurse': return 'info';
    case 'receptionist': return 'warning';
    default: return 'default';
  }
};

export const CreateUserTableColumns = (
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, user: IUsers) => void
): Column[] => [
  {
    id: 'user',
    label: 'User',
    minWidth: 200,
    sortable: false,
    render: (_, row: IUsers) => (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={row.profileImg}
          alt={`${row.firstName} ${row.lastName}`}
          sx={{ width: 40, height: 40 }}
        >
          {row.firstName?.[0]}{row.lastName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {row.id.slice(0, 8)}...
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 180,
  },
  {
    id: 'phoneNumber',
    label: 'Phone',
    minWidth: 130,
  },
  {
    id: 'role',
    label: 'Role',
    minWidth: 120,
    render: (value: string) => (
      <Chip
        label={value.replace('-', ' ').toUpperCase()}
        color={getRoleColor(value) as any}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    id: 'specialization',
    label: 'Specialization',
    minWidth: 150,
    render: (value: string) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'createdAt',
    label: 'Created At',
    minWidth: 120,
    render: (value: string) => (
      <Typography variant="body2">
        {new Date(value).toLocaleDateString()}
      </Typography>
    ),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 80,
    align: 'center',
    sortable: false,
    render: (_, row: IUsers) => (
      <Box display="flex" justifyContent="center">
        <Tooltip title="More actions">
          <IconButton
            size="small"
            onClick={(event) => onMenuOpen(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];