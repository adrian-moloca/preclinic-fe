import React, { FC, useEffect, useState } from "react";
import { InputBase, Paper, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ActiveFilter, AdvancedTableFilters, FilterOption } from "../advance-table-filters/component";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFiltersChange?: (filters: ActiveFilter[]) => void;
  filterOptions?: FilterOption[];
  showFilters?: boolean;
  activeFilters?: ActiveFilter[];
}

export const SearchBar: FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  onSearch,
  onFiltersChange,
  filterOptions = [],
  showFilters = false,
  activeFilters = []
}) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    onSearch(searchValue.trim());
  }, [searchValue, onSearch]);

  const handleFiltersChange = (filters: ActiveFilter[]) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handleClearFilters = () => {
    if (onFiltersChange) {
      onFiltersChange([]);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={showFilters && activeFilters.length > 0 ? 1 : 0}>
        <Paper
          component="form"
          elevation={3}
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 300,
            borderRadius: 2,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            inputProps={{ "aria-label": "search" }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton type="button" sx={{ p: "8px" }}>
            <SearchIcon />
          </IconButton>
        </Paper>

        {showFilters && filterOptions.length > 0 && (
          <AdvancedTableFilters
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </Box>
    </Box>
  );
};