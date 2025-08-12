import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  Toolbar,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FC, useState, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ReusableTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onRowClick?: (row: any) => void;
  onDeleteSelected?: (selectedIds: string[]) => void;
  searchQuery?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  stickyHeader?: boolean;
}

type Order = 'asc' | 'desc';

export const ReusableTable: FC<ReusableTableProps> = ({
  columns,
  data,
  title,
  onRowClick,
  onDeleteSelected,
  searchQuery = "",
  emptyMessage = "No Data Found",
  emptyDescription = "There are currently no items to display.",
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  defaultRowsPerPage = 10,
  enableSelection = false,
  enablePagination = true,
  enableSorting = true,
  stickyHeader = true,
}) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleRequestSort = (property: string) => {
    if (!enableSorting) return;
    
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    if (!enableSorting || !orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return order === 'desc' ? comparison * -1 : comparison;
    });
  }, [data, order, orderBy, enableSorting]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage, enablePagination]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const value = event.target.value;
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleDeleteSelected = () => {
    if (onDeleteSelected && selected.length > 0) {
      onDeleteSelected(selected);
      setSelected([]);
    }
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchQuery ? 'No items match your search criteria.' : emptyDescription}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {enableSelection && selected.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
          </Typography>
          {onDeleteSelected && (
            <Tooltip title="Delete selected">
              <IconButton onClick={handleDeleteSelected}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {enableSorting && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      <strong>{column.label}</strong>
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    <strong>{column.label}</strong>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => {
                    if (enableSelection) {
                      handleClick(row.id);
                    } else if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={{
                    cursor: onRowClick || enableSelection ? 'pointer' : 'default',
                    backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                    '&:hover': { backgroundColor: "#f9f9f9" },
                  }}
                >
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.render ? column.render(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {enablePagination && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                label="Rows per page"
                onChange={handleChangeRowsPerPage}
              >
                {rowsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(page * rowsPerPage + 1, data.length)}-{Math.min((page + 1) * rowsPerPage, data.length)} of {data.length} items
            </Typography>
          </Box>
          
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};