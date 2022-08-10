import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { FulfilledAction, RejectedAction } from './store';
import { Drug } from '../interfaces/drugs.interface';
import { getDrugs, getDrugsByCountry } from '../services/drugs.service';

export interface DrugsState {
    drugs: Array<Drug>;
    loading: boolean;
    error?: string | null;
}

const initialState: DrugsState = {
    drugs: [],
    loading: false
};

export const drugsSlice = createSlice({
    name: 'drugs',
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchDrugs.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchDrugs.fulfilled, (state, action) => {
            state.drugs = action.payload.slice(1, 20);
        })
        .addCase(fetchDrugs.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addCase(fetchDrugsByCountry.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchDrugsByCountry.fulfilled, (state, action) => {
            state.drugs = action.payload.slice(1, 20);
        })
        .addCase(fetchDrugsByCountry.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addMatcher<FulfilledAction | RejectedAction>(
            action => (
                action.type.endsWith('fetchDrugs/fulfilled') ||
                action.type.endsWith('fetchDrugs/rejected') ||
                action.type.endsWith('fetchDrugsByCountry/fulfilled') ||
                action.type.endsWith('fetchDrugsByCountry/rejected')
            ),
            state => {
                state.loading = false;
            }
        )
});

export const fetchDrugs = createAsyncThunk('drugs/fetchDrugs', async () => {
    const response = await getDrugs();
    return response.data;
});

export const fetchDrugsByCountry = createAsyncThunk('drugs/fetchDrugsByCountry', async (countryId: string) => {
    const response = await getDrugsByCountry(countryId);
    return response.data;
});

export default drugsSlice.reducer;
