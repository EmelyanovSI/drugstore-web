import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { CountriesState } from './state';
import { Status } from '../constants/enums';
import { getCountries } from '../services/countries.service';

const initialState: CountriesState = {
    countries: [],
    status: Status.Idle,
    message: null
};

export const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {
        addCountry(state, action) {
            state.countries.push(action.payload);
        }
    },
    extraReducers: builder => builder
        .addCase(fetchCountries.pending, (state) => {
            state.status = Status.Loading;
        })
        .addCase(fetchCountries.fulfilled, (state, action) => {
            state.countries = action.payload;
            state.message = null;
            state.status = Status.Succeeded;
        })
        .addCase(fetchCountries.rejected, (state, action) => {
            state.message = action.error.message;
            state.status = Status.Failed;
        })
});

export const selectCountriesCount = (state: RootState) => state.countriesReducer.countries.length;
export const selectCountriesIsEmpty = (state: RootState) => !state.countriesReducer.countries.length;

export const fetchCountries = createAsyncThunk('drugs/fetchCountries', async () => {
    const response = await getCountries();
    return response.data;
});

export const { addCountry } = countriesSlice.actions;

export default countriesSlice.reducer;
