import React, { useState } from 'react';
import { 
  Grid, 
  CircularProgress, 
  Typography, 
  Box, 
  Card,
  Pagination,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FilterAlt as FilterIcon } from '@mui/icons-material';
import { useGetProductsQuery, useGetFilterOptionsQuery } from '../../features/products/productsApiSlice';
import ProductCard from './ProductCard';
import SearchAndFilter from '../../components/products/SearchAndFilter';
import MobileFilterDrawer from '../../components/products/MobileFilterDrawer';


const ProductGrid = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get filter options to initialize price range
  const { data: filterOptions } = useGetFilterOptionsQuery();

  // Initialize price range when filter options are loaded
  React.useEffect(() => {
    if (filterOptions?.priceRange) {
      setPriceRange([
        filterOptions.priceRange.min,
        filterOptions.priceRange.max
      ]);
    }
  }, [filterOptions]);

  // Fetch products with filters
  const { 
    data: productsData = {}, 
    isLoading, 
    isError,
    error 
  } = useGetProductsQuery({
    search: searchQuery,
    categoryId: selectedCategories.join(','),
    brandId: selectedBrands.join(','),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    page,
    limit: 12
  });

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setPage(1); // Reset to first page when filters change
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
    setPage(1);
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    if (filterOptions?.priceRange) {
      setPriceRange([
        filterOptions.priceRange.min,
        filterOptions.priceRange.max
      ]);
    }
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error loading products: {error.message}
      </Typography>
    );
  }

  const products = productsData.products || [];
  const pagination = productsData.pagination || { totalPages: 1 };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        
        {isMobile && (
          <Button 
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Filters Column - Hidden on mobile */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <SearchAndFilter
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              onSearchChange={setSearchQuery}
              onCategoryToggle={handleCategoryToggle}
              onBrandToggle={handleBrandToggle}
              onPriceChange={handlePriceChange}
              onResetFilters={handleResetFilters}
            />
          </Grid>
        )}

        {/* Products Column */}
        <Grid item xs={12} md={!isMobile ? 9 : 12}>
          {products.length === 0 ? (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Try adjusting your search or filters
              </Typography>
              <Button 
                variant="outlined"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </Button>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map(product => (
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={pagination.totalPages} 
                    page={page}
                    onChange={handlePageChange}
                    color="primary" 
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <SearchAndFilter
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          onSearchChange={setSearchQuery}
          onCategoryToggle={handleCategoryToggle}
          onBrandToggle={handleBrandToggle}
          onPriceChange={handlePriceChange}
          onResetFilters={handleResetFilters}
        />
      </MobileFilterDrawer>
    </Box>
  );
};

export default ProductGrid;