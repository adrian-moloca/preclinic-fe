import React from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Breadcrumbs, 
  Link, 
  IconButton, 
  Tooltip 
} from "@mui/material";
import { 
  NavigateNext, 
  Folder, 
  ViewList, 
  ViewModule 
} from "@mui/icons-material";
import { FolderItem } from "../types";

interface NavigationBreadcrumbsProps {
  breadcrumbs: FolderItem[];
  currentFolder: FolderItem;
  setCurrentFolderId: (id: string) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
}

export function NavigationBreadcrumbs({ 
  breadcrumbs, 
  currentFolder, 
  setCurrentFolderId, 
  viewMode, 
  setViewMode 
}: NavigationBreadcrumbsProps) {
  return (
    <Card sx={{ mb: 3, boxShadow: 1 }}>
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Link
              component="button"
              variant="body1"
              onClick={() => setCurrentFolderId('root')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Folder sx={{ mr: 0.5 }} fontSize="small" />
              Root
            </Link>
            {breadcrumbs.map((folder) => (
              <Link
                key={folder.id}
                component="button"
                variant="body1"
                onClick={() => setCurrentFolderId(folder.id)}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <Folder sx={{ mr: 0.5, color: folder.color }} fontSize="small" />
                {folder.name}
              </Link>
            ))}
          </Breadcrumbs>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="List View">
              <IconButton
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Grid View">
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModule />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}