import React, { FC, useEffect, useState } from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Trigger search on each keystroke
    onSearch(searchValue.trim());
  }, [searchValue, onSearch]);

  return (
    <Paper
      component="form"
      elevation={3}
      sx={{
        p: "2px 8px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 200,
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
  );
};
