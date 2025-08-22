import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useAssistentsContext } from "../../../providers/assistent/context";
import { IAssistent } from "../../../providers/assistent/types";
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/search-bar";
import DeleteModal from "../../../components/delete-modal";
import { Column, ReusableTable } from "../../../components/table/component";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";

export const AllAssistents: FC = () => {
  const { assistents, deleteAssistent } = useAssistentsContext();
  const [filteredAssistents, setFilteredAssistents] = useState<IAssistent[]>(assistents);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAssistent, setSelectedAssistent] = useState<IAssistent | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    setFilteredAssistents(assistents);
  }, [assistents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredAssistents(assistents);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = assistents.filter((assistant) =>
      assistant.firstName?.toLowerCase().includes(lowerQuery) ||
      assistant.lastName?.toLowerCase().includes(lowerQuery) ||
      assistant.email?.toLowerCase().includes(lowerQuery) ||
      assistant.phoneNumber?.toLowerCase().includes(lowerQuery) ||
      assistant.department?.toLowerCase().includes(lowerQuery)
    );

    setFilteredAssistents(filtered);
  };

  const handleRowClick = (assistant: IAssistent) => {
    addRecentItem({
      id: assistant.id,
      type: 'patient',
      title: `${assistant.firstName} ${assistant.lastName}`,
      subtitle: assistant.department || assistant.email || '',
      url: `/assistents/${assistant.id}`,
      metadata: {
        department: assistant.department,
        email: assistant.email,
        phone: assistant.phoneNumber,
      },
    });
    
    navigate(`/assistents/${assistant.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assistant: IAssistent) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedAssistent(assistant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssistent(null);
  };

  const handleEdit = () => {
    if (selectedAssistent) {
      navigate(`/assistents/edit/${selectedAssistent.id}`);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (selectedAssistent) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssistent) return;

    setIsDeleting(true);
    try {
      await deleteAssistent(selectedAssistent.id);
      setDeleteModalOpen(false);
      setSelectedAssistent(null);
    } catch (error) {
      console.error('Error deleting assistant:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteMultiple = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map(id => deleteAssistent(id)));
    } catch (error) {
      console.error('Error deleting assistants:', error);
    }
  };

  const columns: Column[] = [
    {
      id: 'assistant',
      label: 'Assistant',
      minWidth: 200,
      render: (value, row: IAssistent) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={row.profileImg}>
            {row.firstName?.[0]}{row.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
    },
    {
      id: 'phoneNumber',
      label: 'Phone',
      minWidth: 130,
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      render: (value: string) => (
        <Chip label={value || 'Not assigned'} size="small" variant="outlined" />
      ),
    },
    {
      id: 'experience',
      label: 'Experience',
      minWidth: 120,
      render: (value: number) => (
        <Typography variant="body2">
          {value ? `${value} ${value === 1 ? 'year' : 'years'}` : 'Not specified'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      sortable: false,
      render: (_: unknown, row: IAssistent) => {
        const favoriteItem = {
          id: row.id,
          type: 'assistant' as const,
          title: `${row.firstName} ${row.lastName}`,
          subtitle: row.department || row.email || '',
          url: `/assistents/${row.id}`,
          metadata: {
            department: row.department,
            email: row.email,
            phone: row.phoneNumber,
          },
        };

        return (
          <Box display="flex" alignItems="center">
            <FavoriteButton item={favoriteItem} size="small" />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                addRecentItem({
                  id: row.id,
                  type: 'assistant',
                  title: `${row.firstName} ${row.lastName}`,
                  subtitle: row.department || row.email || '',
                  url: `/assistents/${row.id}`,
                  metadata: {
                    department: row.department,
                    email: row.email,
                    phone: row.phoneNumber,
                  },
                });
                navigate(`/assistents/${row.id}`);
              }}
              color="primary"
              size="small"
            >
              <InfoIcon />
            </IconButton>
            <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        All Assistants ({filteredAssistents.length})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search assistants..." />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredAssistents}
        onRowClick={handleRowClick}
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage="No Assistants Found"
        emptyDescription="There are currently no assistants registered."
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Assistant
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Assistant
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Assistant"
        itemName={selectedAssistent ? `${selectedAssistent.firstName} ${selectedAssistent.lastName}` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};