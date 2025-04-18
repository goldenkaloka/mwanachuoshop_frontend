// src/components/products/SearchAndFilter.jsx
import React from 'react';
import {
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Button,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, Close as CloseIcon } from '@mui/icons-material';
import { useGetFilterOptionsQuery } from '../../features/products/productsApiSlice';

const SearchAndFilter = ({ 
  searchQuery,
  selectedCategories,
  selectedBrands,
  priceRange,
  onSearchChange,
  onCategoryToggle,
  onBrandToggle,
  onPriceChange,
  onResetFilters
}) => {
  const { data: filterOptions, isLoading } = useGetFilterOptionsQuery();
  
  const [localSearch, setLocalSearch] = React.useState(searchQuery || '');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);
  
  const handlePriceChange = (event, newValue) => {
    onPriceChange(newValue);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />
        }}
        sx={{ mb: 3 }}
      />
      
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button 
          size="small"
          onClick={onResetFilters}
          startIcon={<CloseIcon />}
        >
          Clear All
        </Button>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {filterOptions?.categories?.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => onCategoryToggle(category.id)}
                      />
                    }
                    label={`${category.name} (${category.product_count})`}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Brands</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {filterOptions?.brands?.map((brand) => (
                  <FormControlLabel
                    key={brand.id}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => onBrandToggle(brand.id)}
                      />
                    }
                    label={`${brand.name} (${brand.product_count})`}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Price Range</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={filterOptions?.priceRange?.min || 0}
                max={filterOptions?.priceRange?.max || 1000}
                sx={{ width: '95%', mx: 'auto' }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  ${priceRange[0]}
                </Typography>
                <Typography variant="body2">
                  ${priceRange[1]}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}
      
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
        priceRange[0] > (filterOptions?.priceRange?.min || 0) || 
        priceRange[1] < (filterOptions?.priceRange?.max || 1000)) && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Active Filters:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedCategories.map(catId => {
              const category = filterOptions?.categories?.find(c => c.id === catId);
              return category ? (
                <Chip
                  key={catId}
                  label={`Category: ${category.name}`}
                  onDelete={() => onCategoryToggle(catId)}
                />
              ) : null;
            })}
            {selectedBrands.map(brandId => {
              const brand = filterOptions?.brands?.find(b => b.id === brandId);
              return brand ? (
                <Chip
                  key={brandId}
                  label={`Brand: ${brand.name}`}
                  onDelete={() => onBrandToggle(brandId)}
                />
              ) : null;
            })}
            {(priceRange[0] > (filterOptions?.priceRange?.min || 0) || 
              priceRange[1] < (filterOptions?.priceRange?.max || 1000)) && (
              <Chip
                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                onDelete={() => onPriceChange([
                  filterOptions?.priceRange?.min || 0, 
                  filterOptions?.priceRange?.max || 1000
                ])}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchAndFilter;