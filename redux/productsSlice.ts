import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
};

type ProductsState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const PRODUCTS_URL = 'https://api.escuelajs.co/api/v1/products';

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadProducts = createAsyncThunk('products/loadProducts', async () => {
  const response = await fetch(PRODUCTS_URL);

  if (!response.ok) {
    throw new Error('Unable to load products right now.');
  }

  return (await response.json()) as Product[];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unable to load products.';
      });
  },
});

export const productsReducer = productsSlice.reducer;
