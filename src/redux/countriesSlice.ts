import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { FulfilledAction, RejectedAction, RootState } from './store';
import { Country } from '../interfaces/countries.interface';
import { getCountries } from '../services/countries.service';

export interface CountriesState {
    countries: Array<Country>;
    loading: boolean;
    error?: string | null;
}

const initialState: CountriesState = {
    countries: [],
    loading: false
};

export const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchCountries.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchCountries.fulfilled, (state, action) => {
            state.countries = action.payload;
        })
        .addCase(fetchCountries.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addMatcher<FulfilledAction | RejectedAction>(
            action => (
                action.type.endsWith('fetchCountries/fulfilled') ||
                action.type.endsWith('fetchCountries/rejected')
            ),
            state => {
                state.loading = false;
            }
        )
});

export const selectCountriesCount = (state: RootState) => state.countriesReducer.countries.length;
export const selectCountriesIsEmpty = (state: RootState) => !state.countriesReducer.countries.length;

export const fetchCountries = createAsyncThunk('drugs/fetchCountries', async () => {
    const response = await getCountries();
    return response.data;
});

export default countriesSlice.reducer;
