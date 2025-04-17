// pages/Products/ProductEditPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  useGetProductQuery,
  useUpdateProductMutation 
} from '../../features/products/productsApiSlice';
import ProductForm from '../../components/products/ProductForm';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(id);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleSubmit = async (values) => {
    try {
      // Convert form data to FormData for file uploads
      const formData = new FormData();
      
      // Append product fields
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('type', values.type);
      formData.append('brand', values.brand);
      formData.append('category', values.category);
      formData.append('is_featured', values.is_featured);
      
      // Append product lines
      values.product_lines.forEach((line, lineIndex) => {
        formData.append(`product_lines[${lineIndex}][price]`, line.price);
        formData.append(`product_lines[${lineIndex}][sale_price]`, line.sale_price || '');
        formData.append(`product_lines[${lineIndex}][sku]`, line.sku);
        formData.append(`product_lines[${lineIndex}][stock_qty]`, line.stock_qty);
        formData.append(`product_lines[${lineIndex}][is_active]`, line.is_active);
        
        // Append images for each line
        line.images.forEach((image, imageIndex) => {
          if (image.image instanceof File) {
            formData.append(`product_lines[${lineIndex}][images][${imageIndex}][image]`, image.image);
            formData.append(`product_lines[${lineIndex}][images][${imageIndex}][alt_text]`, image.alt_text);
            formData.append(`product_lines[${lineIndex}][images][${imageIndex}][is_primary]`, image.is_primary);
            formData.append(`product_lines[${lineIndex}][images][${imageIndex}][order]`, image.order);
          } else {
            // For existing images, just send the ID
            formData.append(`product_lines[${lineIndex}][images][${imageIndex}][id]`, image.id);
          }
        });
      });
      
      await updateProduct({ id, data: formData }).unwrap();
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      navigate(`/products/${id}`);
    } catch (error) {
      enqueueSnackbar('Failed to update product', { variant: 'error' });
      console.error('Product update error:', error);
    }
  };

  if (isLoadingProduct) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <ProductForm 
        initialValues={product} 
        onSubmit={handleSubmit}
        isEditing={true}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductEditPage;