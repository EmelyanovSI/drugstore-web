import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { FulfilledAction, RejectedAction, RootState } from './store';
import { Drug } from '../interfaces/drugs.interface';
import { getDrugById, getDrugs, getDrugsByCountry } from '../services/drugs.service';

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
        .addCase(fetchDrugsByIds.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchDrugsByIds.fulfilled, (state, action) => {
            state.drugs = action.payload;
        })
        .addCase(fetchDrugsByIds.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addMatcher<FulfilledAction | RejectedAction>(
            action => (
                action.type.endsWith('fetchDrugs/fulfilled') ||
                action.type.endsWith('fetchDrugs/rejected') ||
                action.type.endsWith('fetchDrugsByCountry/fulfilled') ||
                action.type.endsWith('fetchDrugsByCountry/rejected') ||
                action.type.endsWith('fetchDrugsByIds/fulfilled') ||
                action.type.endsWith('fetchDrugsByIds/rejected')
            ),
            state => {
                state.loading = false;
            }
        )
});

export const selectDrugsCount = (state: RootState) => state.drugsReducer.drugs.length;
export const selectDrugsIsEmpty = (state: RootState) => !state.drugsReducer.drugs.length;

export const fetchDrugs = createAsyncThunk('drugs/fetchDrugs', async () => {
    const response = await getDrugs();
    return response.data;
});

export const fetchDrugsByCountry = createAsyncThunk('drugs/fetchDrugsByCountry', async (countryId: string) => {
    const response = await getDrugsByCountry(countryId);
    return response.data;
});

export const fetchDrugsByIds = createAsyncThunk('drugs/fetchDrugsByIds', async (drugsIds: Array<string>) => {
    const drugsByIds = [];
    for (const id of drugsIds) {
        const response = await getDrugById(id);
        drugsByIds.push(response.data);
    }
    return drugsByIds;
});

export default drugsSlice.reducer;
