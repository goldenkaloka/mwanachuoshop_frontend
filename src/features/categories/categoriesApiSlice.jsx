import { apiSlice } from '../../api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => '/categories/',
      providesTags: ['Categories']
    }),
    // Add other category endpoints as needed
  })
});

export const { useGetCategoriesQuery } = categoriesApiSlice;