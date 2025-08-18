import React from "react";
import { Grid, Card, Typography } from "@mui/material";
import { FileItem, FolderItem } from "../types";

interface FileStatisticsProps {
  sortedFiles: FileItem[];
  currentFolders: FolderItem[];
}

export function FileStatistics({ sortedFiles, currentFolders }: FileStatisticsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="primary">
            {sortedFiles.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Files
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="success.main">
            {currentFolders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Folders
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="warning.main">
            {sortedFiles.filter(f => f.isConfidential).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Confidential
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="info.main">
            {sortedFiles.filter(f => f.sharedWith.length > 0).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shared
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="error.main">
            {sortedFiles.filter(f => f.patientId).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Linked to Patients
          </Typography>
        </Card>
      </Grid>
      <Grid>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h4" color="secondary.main">
            {Math.round(sortedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024)}MB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Size
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}