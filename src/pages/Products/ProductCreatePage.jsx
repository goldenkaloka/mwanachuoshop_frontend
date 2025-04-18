import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCreateProductMutation } from '../../features/products/productsApiSlice';
import ProductForm from '../../components/products/ProductForm';
import { Typography } from '@mui/material'; // Added this import

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const handleSubmit = async (values) => {
    try {
      // Convert to format backend expects
      const productData = {
        name: values.name,
        description: values.description,
        type: values.type,
        brand: values.brand,
        category: values.category,
        is_featured: values.is_featured,
        product_lines: values.product_lines.map(line => ({
          price: line.price,
          sale_price: line.sale_price || null,
          sku: line.sku,
          stock_qty: line.stock_qty,
          is_active: line.is_active,
          images: line.images.map(img => ({
            image: img.image, // This should be a File object
            alt_text: img.alt_text,
            is_primary: img.is_primary,
            order: img.order
          }))
        }))
      };
  
      // Use FormData only if you have file uploads
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      
      // Append files separately if needed
      values.product_lines.forEach((line, lineIndex) => {
        line.images.forEach((image, imageIndex) => {
          if (image.image instanceof File) {
            formData.append(`image_${lineIndex}_${imageIndex}`, image.image);
          }
        });
      });
  
      const product = await createProduct(formData).unwrap();
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      navigate(`/products/${product.id}`);
    } catch (error) {
      enqueueSnackbar(error.data?.message || 'Failed to create product', { 
        variant: 'error' 
      });
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