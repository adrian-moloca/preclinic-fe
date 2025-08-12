import { 
  Box, 
  Typography, 
  Rating,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from "@mui/material";
import { FC, useState } from "react";
import { Delete } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from '@mui/icons-material/Info';
import { MockReviews } from "../../../mock/reviews";
import { useReviewsContext } from "../../../providers/reviews";
import { DeleteModal } from "../../../components/delete-modal/component";
import SearchBar from "../../../components/search-bar";
import { useNavigate } from "react-router-dom";
import { Column, ReusableTable } from "../../../components/table/component";

export const AllReviews: FC = () => {
  const { deleteReview } = useReviewsContext();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState(MockReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDeleteClick = () => {
    if (selectedReview) {
      setDeleteModalOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    
    setIsDeleting(true);
    try {
      setReviews(prevReviews => prevReviews.filter(review => review.id !== selectedReview.id));
      
      try {
        await deleteReview(selectedReview.id);
      } catch (contextError) {
        console.warn('Context delete failed (expected with mock data):', contextError);
      }
      
      setDeleteModalOpen(false);
      setSelectedReview(null);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting review:', error);
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
      setReviews(prevReviews => 
        prevReviews.filter(review => !selectedIds.includes(review.id))
      );
      
      try {
        await Promise.all(selectedIds.map(id => deleteReview(id)));
      } catch (contextError) {
        console.warn('Context delete failed (expected with mock data):', contextError);
      }
    } catch (error) {
      console.error('Error deleting reviews:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, review: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!deleteModalOpen) {
      setSelectedReview(null);
    }
  };

  const handleEditReview = () => {
    if (selectedReview) {
      navigate(`/reviews/edit/${selectedReview.id}`);
      handleMenuClose();
    }
  };

  const handleRowClick = (review: any) => {
    navigate(`/reviews/${review.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredReviews = reviews.filter(review => {
    if (!searchQuery.trim()) return true;
    
    const lowerQuery = searchQuery.toLowerCase();
    return (
      review.name.toLowerCase().includes(lowerQuery) ||
      review.review.toLowerCase().includes(lowerQuery) ||
      review.rating.toString().includes(lowerQuery) ||
      review.date.toLowerCase().includes(lowerQuery)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns: Column[] = [
    {
      id: 'patient',
      label: 'Patient',
      minWidth: 200,
      sortable: false,
      render: (_, row: any) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            src={row.img} 
            alt={row.name}
            sx={{ width: 40, height: 40 }}
          >
            {row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Patient ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'rating',
      label: 'Rating',
      minWidth: 150,
      sortable: false,
      render: (_, row: any) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Rating 
            value={row.rating} 
            readOnly 
            size="small"
            precision={0.5}
          />
          <Typography variant="body2" color="text.secondary">
            ({row.rating})
          </Typography>
        </Box>
      ),
    },
    {
      id: 'review',
      label: 'Review',
      minWidth: 300,
      sortable: false,
      render: (value: string) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      minWidth: 120,
      render: (value: string) => (
        <Typography variant="body2">
          {formatDate(value)}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'right',
      sortable: false,
      render: (_, row: any) => (
        <Box>
          <Tooltip title="View Review Details">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/reviews/${row.id}`);
              }}
              color="primary"
              size="small"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => handleMenuOpen(e, row)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        All Reviews ({filteredReviews.length})
      </Typography>
      
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <ReusableTable
        columns={columns}
        data={filteredReviews}
        onRowClick={handleRowClick}
        onDeleteSelected={handleDeleteMultiple}
        searchQuery={searchQuery}
        emptyMessage="No Reviews Found"
        emptyDescription="There are currently no reviews to display."
        enableSelection={true}
        enablePagination={true}
        enableSorting={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        defaultRowsPerPage={10}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditReview}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
          Delete
        </MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        itemName={selectedReview?.name ? `${selectedReview.name}'s review` : undefined}
        message={selectedReview ? `Are you sure you want to delete this review from ${selectedReview.name}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
        deleteButtonText="Delete Review"
      />
    </Box>
  );
};