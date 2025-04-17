import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { useGetBrandsQuery } from '../../features/brands/brandsApiSlice';




const ProductForm = ({ initialValues, onSubmit, isEditing, isLoading }) => {
  const [productLines, setProductLines] = useState(
    initialValues?.product_lines || [{
      price: '',
      sale_price: '',
      sku: '',
      stock_qty: 0,
      is_active: true,
      images: [],
      attribute_values: []
    }]
  );

  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetBrandsQuery();

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Product type is required'),
    brand: Yup.string().required('Brand is required'),
    category: Yup.string().required('Category is required'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      type: 'physical',
      brand: '',
      category: '',
      is_featured: false,
      product_lines: productLines,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        product_lines: productLines,
      });
    },
  });

  const handleAddProductLine = () => {
    setProductLines([
      ...productLines,
      {
        price: '',
        sale_price: '',
        sku: '',
        stock_qty: 0,
        is_active: true,
        images: [],
        attribute_values: []
      }
    ]);
  };

  const handleRemoveProductLine = (index) => {
    if (productLines.length > 1) {
      const newLines = [...productLines];
      newLines.splice(index, 1);
      setProductLines(newLines);
    }
  };

  const handleProductLineChange = (index, field, value) => {
    const newLines = [...productLines];
    newLines[index][field] = value;
    setProductLines(newLines);
  };

  const handleImageUpload = (lineIndex, files) => {
    const newLines = [...productLines];
    const uploadedImages = Array.from(files).map(file => ({
      image: file,
      alt_text: file.name,
      is_primary: newLines[lineIndex].images.length === 0,
      order: newLines[lineIndex].images.length
    }));
    
    newLines[lineIndex].images = [...newLines[lineIndex].images, ...uploadedImages];
    setProductLines(newLines);
  };

  const handleSetPrimaryImage = (lineIndex, imageIndex) => {
    const newLines = [...productLines];
    newLines[lineIndex].images.forEach((img, idx) => {
      img.is_primary = idx === imageIndex;
    });
    setProductLines(newLines);
  };

  const handleRemoveImage = (lineIndex, imageIndex) => {
    const newLines = [...productLines];
    newLines[lineIndex].images.splice(imageIndex, 1);
    setProductLines(newLines);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Product Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                    <InputLabel id="type-label">Product Type</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type"
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      label="Product Type"
                    >
                      <MenuItem value="physical">Physical</MenuItem>
                      <MenuItem value="digital">Digital</MenuItem>
                      <MenuItem value="service">Service</MenuItem>
                    </Select>
                    {formik.touched.type && formik.errors.type && (
                      <FormHelperText>{formik.errors.type}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.brand && Boolean(formik.errors.brand)}>
                    <InputLabel id="brand-label">Brand</InputLabel>
                    <Select
                      labelId="brand-label"
                      id="brand"
                      name="brand"
                      value={formik.values.brand}
                      onChange={formik.handleChange}
                      label="Brand"
                      disabled={loadingBrands}
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.brand && formik.errors.brand && (
                      <FormHelperText>{formik.errors.brand}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      label="Category"
                      disabled={loadingCategories}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <FormHelperText>{formik.errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Chip
                      label="Featured Product"
                      color={formik.values.is_featured ? 'primary' : 'default'}
                      onClick={() => formik.setFieldValue('is_featured', !formik.values.is_featured)}
                      variant={formik.values.is_featured ? 'filled' : 'outlined'}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {productLines.map((line, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Product Variant #{index + 1}</Typography>
                  {productLines.length > 1 && (
                    <IconButton onClick={() => handleRemoveProductLine(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={line.price}
                      onChange={(e) => handleProductLineChange(index, 'price', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Sale Price"
                      type="number"
                      value={line.sale_price}
                      onChange={(e) => handleProductLineChange(index, 'sale_price', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="SKU"
                      value={line.sku}
                      onChange={(e) => handleProductLineChange(index, 'sku', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      type="number"
                      value={line.stock_qty}
                      onChange={(e) => handleProductLineChange(index, 'stock_qty', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Chip
                        label="Active Variant"
                        color={line.is_active ? 'success' : 'default'}
                        onClick={() => handleProductLineChange(index, 'is_active', !line.is_active)}
                        variant={line.is_active ? 'filled' : 'outlined'}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Images
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`variant-${index}-images`}
                        type="file"
                        multiple
                        onChange={(e) => handleImageUpload(index, e.target.files)}
                      />
                      <label htmlFor={`variant-${index}-images`}>
                        <Button variant="outlined" component="span">
                          Upload Images
                        </Button>
                      </label>
                    </Box>
                    
                    {line.images.length > 0 && (
                      <Grid container spacing={1}>
                        {line.images.map((img, imgIndex) => (
                          <Grid item xs={4} sm={3} key={imgIndex}>
                            <Box
                              sx={{
                                position: 'relative',
                                paddingTop: '100%',
                                border: img.is_primary ? '2px solid #1976d2' : '1px solid #ddd',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <img
                                src={img.image instanceof File ? URL.createObjectURL(img.image) : img.image}
                                alt={img.alt_text}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  display: 'flex',
                                  gap: 1
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleSetPrimaryImage(index, imgIndex)}
                                  color={img.is_primary ? 'primary' : 'default'}
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                    }
                                  }}
                                >
                                  <span>★</span>
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveImage(index, imgIndex)}
                                  color="error"
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddProductLine}
            sx={{ mb: 3 }}
          >
            Add Variant
          </Button>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEditing ? (
                  'Update Product'
                ) : (
                  'Create Product'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;