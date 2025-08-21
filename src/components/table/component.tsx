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
  Checkbox,
  Toolbar,
  alpha,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  TextField,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { FC, useState, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { visuallyHidden } from "@mui/utils";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  editable?: boolean;
  visible?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  editRender?: (value: any, row: any, onSave: (newValue: any) => void, onCancel: () => void) => React.ReactNode;
}

export interface TablePreset {
  id: string;
  name: string;
  columns: Column[];
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
  filters?: Record<string, any>;
}

export interface ReusableTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onRowClick?: (row: any) => void;
  onDeleteSelected?: (selectedIds: string[]) => void;
  onUpdateRow?: (id: string, updatedData: any) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  searchQuery?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableColumnCustomization?: boolean;
  enableExport?: boolean;
  enablePresets?: boolean;
  enableInlineEdit?: boolean;
  stickyHeader?: boolean;
  bulkActions?: { label: string; value: string; icon?: React.ReactNode; color?: string }[];
  presets?: TablePreset[];
  onPresetSave?: (preset: TablePreset) => void;
  onPresetLoad?: (preset: TablePreset) => void;
}

type Order = 'asc' | 'desc';

export const ReusableTable: FC<ReusableTableProps> = ({
  columns: initialColumns,
  data,
  title,
  onRowClick,
  onDeleteSelected,
  onUpdateRow,
  onBulkAction,
  searchQuery = "",
  emptyMessage = "No Data Found",
  emptyDescription = "There are currently no items to display.",
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  defaultRowsPerPage = 10,
  enableSelection = false,
  enablePagination = true,
  enableSorting = true,
  enableColumnCustomization = true,
  enableExport = true,
  enablePresets = true,
  enableInlineEdit = false,
  stickyHeader = true,
  bulkActions = [],
  presets = [],
  onPresetSave,
  onPresetLoad,
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [columns, setColumns] = useState<Column[]>(
    initialColumns.map(col => ({ ...col, visible: col.visible !== false }))
  );
  const [columnCustomizationOpen, setColumnCustomizationOpen] = useState(false);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [bulkActionAnchorEl, setBulkActionAnchorEl] = useState<null | HTMLElement>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editingValue, setEditingValue] = useState<any>('');
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({ message, severity });
  };

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

      return order === 'desc' ? -comparison : comparison;
    });
  }, [data, order, orderBy, enableSorting]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return sortedData;
    
    const query = searchQuery.toLowerCase();
    return sortedData.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(query)
      )
    );
  }, [sortedData, searchQuery]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return filteredData;
    
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage, enablePagination]);

  const visibleColumns = useMemo(() => 
    columns.filter(col => col.visible !== false),
    [columns]
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((row) => row.id || row._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    if (!enableSelection) return;
    
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible } : col
      )
    );
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const currentIndex = columns.findIndex(col => col.id === columnId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= columns.length) return;

    const newColumns = [...columns];
    [newColumns[currentIndex], newColumns[newIndex]] = [newColumns[newIndex], newColumns[currentIndex]];
    
    setColumns(newColumns);
    showNotification('Column moved successfully!', 'success');
  };

  const exportToCSV = () => {
    const csvContent = [
      visibleColumns.map(col => col.label).join(','),
      ...filteredData.map(row =>
        visibleColumns.map(col => {
          const value = row[col.id];
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title || 'table-data'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported to CSV successfully!', 'success');
    setExportAnchorEl(null);
  };

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map(row => {
          const filteredRow: any = {};
          visibleColumns.forEach(col => {
            filteredRow[col.label] = row[col.id];
          });
          return filteredRow;
        })
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${title || 'table-data'}.xlsx`);
      
      showNotification('Data exported to Excel successfully!', 'success');
    } catch (error) {
      showNotification('Excel export not available. Please install xlsx package.', 'error');
    }
    setExportAnchorEl(null);
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    
    const preset: TablePreset = {
      id: Date.now().toString(),
      name: presetName,
      columns: [...columns],
      sortOrder: order,
      sortBy: orderBy,
    };

    onPresetSave?.(preset);
    setPresetName('');
    setPresetDialogOpen(false);
    showNotification(`Preset "${presetName}" saved successfully!`, 'success');
  };

  const loadPreset = (preset: TablePreset) => {
    setColumns(preset.columns);
    if (preset.sortOrder && preset.sortBy) {
      setOrder(preset.sortOrder);
      setOrderBy(preset.sortBy);
    }
    onPresetLoad?.(preset);
    showNotification(`Preset "${preset.name}" loaded successfully!`, 'success');
  };

  // Inline Editing
  const startEditing = (rowId: string, columnId: string, currentValue: any) => {
    setEditingCell({ rowId, columnId });
    setEditingValue(currentValue);
  };

  const saveEdit = (rowId: string, columnId: string) => {
    onUpdateRow?.(rowId, { [columnId]: editingValue });
    setEditingCell(null);
    setEditingValue('');
    showNotification('Cell updated successfully!', 'success');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete' && onDeleteSelected) {
      onDeleteSelected(selected);
    } else if (onBulkAction) {
      onBulkAction(action, selected);
    }
    setSelected([]);
    setBulkActionAnchorEl(null);
    showNotification(`Bulk action "${action}" completed!`, 'success');
  };

  if (filteredData.length === 0 && !searchQuery) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={300}
        textAlign="center"
        sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1, p: 3 }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {(enableSelection && selected.length > 0) ? (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {selected.length} selected
          </Typography>
          
          {bulkActions.length > 0 && (
            <Tooltip title="Bulk Actions">
              <IconButton 
                onClick={(e) => setBulkActionAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onDeleteSelected && (
            <Tooltip title="Delete Selected">
              <IconButton onClick={() => onDeleteSelected(selected)} color="inherit">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      ) : (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          {title && (
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
              {title}
            </Typography>
          )}
          
          <Stack direction="row" spacing={1}>
            {enableColumnCustomization && (
              <Tooltip title="Customize Columns">
                <IconButton onClick={() => setColumnCustomizationOpen(true)}>
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {enableExport && (
              <Tooltip title="Export Data">
                <IconButton onClick={(e) => setExportAnchorEl(e.currentTarget)}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {enablePresets && (
              <Tooltip title="Save/Load Presets">
                <IconButton onClick={() => setPresetDialogOpen(true)}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: stickyHeader ? 440 : undefined }}>
        <Table stickyHeader={stickyHeader} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable && enableSorting ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              const isItemSelected = isSelected(row.id || row._id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => {
                    if (!enableSelection) {
                      onRowClick?.(row);
                    } else {
                      handleClick(event, row.id || row._id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id || row._id || index}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick(event, row.id || row._id);
                        }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => {
                    const value = row[column.id];
                    const isEditing = editingCell?.rowId === (row.id || row._id) && editingCell?.columnId === column.id;
                    
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {isEditing ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            {column.editRender ? (
                              column.editRender(editingValue, row, 
                                () => saveEdit(row.id || row._id, column.id),
                                cancelEdit
                              )
                            ) : (
                              <>
                                <TextField
                                  size="small"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveEdit(row.id || row._id, column.id);
                                    } else if (e.key === 'Escape') {
                                      cancelEdit();
                                    }
                                  }}
                                  autoFocus
                                />
                                <IconButton size="small" onClick={() => saveEdit(row.id || row._id, column.id)}>
                                  <CheckIcon />
                                </IconButton>
                                <IconButton size="small" onClick={cancelEdit}>
                                  <CloseIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        ) : (
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="space-between"
                            onDoubleClick={() => {
                              if (enableInlineEdit && column.editable) {
                                startEditing(row.id || row._id, column.id, value);
                              }
                            }}
                          >
                            <Box flex={1}>
                              {column.render ? column.render(value, row) : value}
                            </Box>
                            {enableInlineEdit && column.editable && (
                              <IconButton 
                                size="small" 
                                sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(row.id || row._id, column.id, value);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        )}
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
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Dialog open={columnCustomizationOpen} onClose={() => setColumnCustomizationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Customize Columns</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Show/hide columns and use arrows to reorder
          </Typography>
          <Box mt={2}>
            <List>
              {columns.map((column, index) => (
                <ListItem key={column.id} sx={{ borderRadius: 1, mb: 0.5 }}>
                  <ListItemIcon>
                    <Box display="flex" flexDirection="column">
                      <IconButton 
                        size="small" 
                        disabled={index === 0}
                        onClick={() => moveColumn(column.id, 'up')}
                      >
                        <KeyboardArrowUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        disabled={index === columns.length - 1}
                        onClick={() => moveColumn(column.id, 'down')}
                      >
                        <KeyboardArrowDownIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={column.label} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={column.visible !== false}
                      onChange={(e) => handleColumnVisibilityChange(column.id, e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnCustomizationOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={() => setExportAnchorEl(null)}
      >
        <MenuItem onClick={exportToCSV}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export to CSV
        </MenuItem>
        <MenuItem onClick={exportToExcel}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export to Excel
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={bulkActionAnchorEl}
        open={Boolean(bulkActionAnchorEl)}
        onClose={() => setBulkActionAnchorEl(null)}
      >
        {bulkActions.map((action) => (
          <MenuItem key={action.value} onClick={() => handleBulkAction(action.value)}>
            {action.icon && <Box sx={{ mr: 1 }}>{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Preset Dialog */}
      <Dialog open={presetDialogOpen} onClose={() => setPresetDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Table Presets</DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Save Current View</Typography>
            <TextField
              fullWidth
              label="Preset Name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              size="small"
            />
          </Box>
          
          {presets.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Load Preset</Typography>
              <Stack spacing={1}>
                {presets.map((preset) => (
                  <Chip
                    key={preset.id}
                    label={preset.name}
                    onClick={() => loadPreset(preset)}
                    variant="outlined"
                    clickable
                  />
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPresetDialogOpen(false)}>Cancel</Button>
          <Button onClick={savePreset} variant="contained" disabled={!presetName.trim()}>
            Save Preset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.severity}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};