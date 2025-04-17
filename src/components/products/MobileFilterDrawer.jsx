// src/components/products/MobileFilterDrawer.jsx
import React from 'react';
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import { FilterAlt as FilterIcon, Close as CloseIcon } from '@mui/icons-material';

const MobileFilterDrawer = ({ 
  open, 
  onClose,
  children 
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '80%',
          maxWidth: 350,
          p: 2
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {children}
      
      <Button 
        variant="contained"
        fullWidth
        onClick={onClose}
        sx={{ mt: 2 }}
      >
        Apply Filters
      </Button>
    </Drawer>
  );
};

export default MobileFilterDrawer;