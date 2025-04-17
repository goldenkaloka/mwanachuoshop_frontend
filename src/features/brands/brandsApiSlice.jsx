import { apiSlice } from "../../api/apiSlice";

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBrands: builder.query({
      query: () => '/brands/',
      providesTags: ['Brands']
    }),
    // Add other brand endpoints as needed
  })
});

export const { useGetBrandsQuery } = brandsApiSlice;