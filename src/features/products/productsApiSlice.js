import { apiSlice } from '../../api/apiSlice';

// Helper function to safely calculate price range
const getPriceRange = (productLines) => {
  if (!Array.isArray(productLines)) return { min: 0, max: 0 };
  
  const prices = productLines
    .map(line => parseFloat(line.current_price) || 0)
    .filter(price => !isNaN(price));

  if (prices.length === 0) return { min: 0, max: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Reusable product transformer
const transformProduct = (product) => ({
  ...product,
  price_range: getPriceRange(product.product_lines || [])
});

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products/',
        params: {
          shop_id: params.shopId,
          category_id: params.categoryId,
          brand_id: params.brandId,
          search: params.search,
          min_price: params.minPrice,
          max_price: params.maxPrice,
          is_featured: params.isFeatured,
          is_active: params.isActive,
          owner_id: params.ownerId,
          page: params.page,
          limit: params.limit,
          sort_by: params.sortBy,
          sort_order: params.sortOrder
        }
      }),
      transformResponse: (response) => {
        const rawData = response.data || response;
        const products = Array.isArray(rawData.products) 
          ? rawData.products.map(transformProduct)
          : Array.isArray(rawData)
            ? rawData.map(transformProduct)
            : [];
        
        return rawData.pagination 
          ? { products, pagination: rawData.pagination }
          : products;
      },
      providesTags: (result) => {
        const tags = ['Products'];
        if (result?.products) {
          tags.push(...result.products.map(p => ({ type: 'Product', id: p.id })));
        }
        return tags;
      }
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => transformProduct(response.data || response),
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products/',
        method: 'POST',
        body: productData
      }),
      invalidatesTags: ['Products']
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData
      }),
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Product', id }
      ]
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    }),

    getUserProducts: builder.query({
      query: (params = {}) => ({
        url: '/products/me/',
        params: {
          page: params.page,
          limit: params.limit,
          is_active: params.isActive
        }
      }),
      transformResponse: (response) => {
        const rawData = response.data || response;
        return Array.isArray(rawData) 
          ? rawData.map(transformProduct)
          : [];
      },
      providesTags: ['Products']
    }),

    getFilterOptions: builder.query({
      query: () => '/products/filter-options/',
      transformResponse: (response) => ({
        categories: response.categories || [],
        brands: response.brands || [],
        priceRange: response.price_range || { min: 0, max: 1000 }
      })
    }),

    initiateProductPayment: builder.mutation({
      query: ({ productId, paymentMethod = 'azampay' }) => ({
        url: '/payment/product/',
        method: 'POST',
        body: { 
          product_id: productId, 
          payment_method: paymentMethod 
        }
      })
    }),

    initiateSubscriptionPayment: builder.mutation({
      query: ({ planSlug, paymentMethod = 'azampay' }) => ({
        url: '/payment/subscription/',
        method: 'POST',
        body: { 
          plan: planSlug, 
          payment_method: paymentMethod 
        }
      })
    }),

    getRelatedProducts: builder.query({
      query: ({ productId, limit = 4 }) => ({
        url: `/products/${productId}/related/`,
        params: { limit }
      }),
      transformResponse: (response) => 
        (Array.isArray(response.data) ? response.data : response)
          .map(transformProduct)
    }),

    getFeaturedProducts: builder.query({
      query: (limit = 8) => ({
        url: '/products/featured/',
        params: { limit }
      }),
      transformResponse: (response) => 
        (Array.isArray(response.data) ? response.data : response)
          .map(transformProduct)
    })
  })
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUserProductsQuery,
  useLazyGetUserProductsQuery,
  useGetFilterOptionsQuery,
  useInitiateProductPaymentMutation,
  useInitiateSubscriptionPaymentMutation,
  useGetRelatedProductsQuery,
  useGetFeaturedProductsQuery
} = productsApiSlice;