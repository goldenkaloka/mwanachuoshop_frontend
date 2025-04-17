// pages/Products/ProductCreatePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCreateProductMutation } from '../../features/products/productsApiSlice';
import ProductForm from '../../components/products/ProductForm';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [createProduct, { isLoading }] = useCreateProductMutation();

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
          }
        });
      });
      
      const product = await createProduct(formData).unwrap();
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      navigate(`/products/${product.id}`);
    } catch (error) {
      enqueueSnackbar('Failed to create product', { variant: 'error' });
      console.error('Product creation error:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Create New Product
      </Typography>
      <ProductForm 
        onSubmit={handleSubmit}
        isEditing={false}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductCreatePage;