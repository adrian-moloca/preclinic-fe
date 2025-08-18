import React from "react";
import { Card, CardContent, Typography, Grid, Box, Badge } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { FolderItem } from "../types";

interface FoldersDisplayProps {
  currentFolders: FolderItem[];
  setCurrentFolderId: (id: string) => void;
}

export function FoldersDisplay({ currentFolders, setCurrentFolderId }: FoldersDisplayProps) {
  if (currentFolders.length === 0) return null;

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Folders
        </Typography>
        <Grid container spacing={2}>
          {currentFolders.map((folder) => (
            <Grid key={folder.id}>
              <Card
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setCurrentFolderId(folder.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Folder sx={{ color: folder.color, mr: 1, fontSize: 32 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {folder.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {folder.fileCount} files
                    </Typography>
                  </Box>
                  {folder.isPatientFolder && (
                    <Badge color="primary" variant="dot" />
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}