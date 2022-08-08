import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { FulfilledAction, RejectedAction } from './store';
import { Drug } from '../interfaces/drugs.interface';
import { getDrugs } from '../services/drugs.service';

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
            state.drugs = action.payload.slice(1, 10);
        })
        .addCase(fetchDrugs.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addMatcher<FulfilledAction | RejectedAction>(
            action => (
                action.type.endsWith('fetchDrugs/fulfilled') ||
                action.type.endsWith('fetchDrugs/rejected')
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

export default drugsSlice.reducer;
