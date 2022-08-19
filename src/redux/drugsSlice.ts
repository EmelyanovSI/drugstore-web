import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { RootState } from './store';
import { DrugsState } from './state';
import { Status } from '../constants/enums';
import { getDrugById, getDrugs, getDrugsByCountry } from '../services/drugs.service';

const initialState: DrugsState = {
    drugs: [],
    status: Status.Idle,
    message: null
};

export const drugsSlice = createSlice({
    name: 'drugs',
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addMatcher(isPending(
            fetchDrugs,
            fetchDrugsByCountry,
            fetchDrugsByIds,
            fetchDrugsByActiveSubstance
        ), (state) => {
            state.status = Status.Loading;
        })
        .addMatcher(isFulfilled(
            fetchDrugs,
            fetchDrugsByCountry,
            fetchDrugsByIds,
            fetchDrugsByActiveSubstance
        ), (state, action) => {
            state.drugs = action.payload.slice(0, 20);
            state.message = null;
            state.status = Status.Succeeded;
        })
        .addMatcher(isRejected(
            fetchDrugs,
            fetchDrugsByCountry,
            fetchDrugsByIds,
            fetchDrugsByActiveSubstance
        ), (state, action) => {
            state.message = action.error.message;
            state.status = Status.Failed;
        })
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

export const fetchDrugsByActiveSubstance = createAsyncThunk(
    'drugs/fetchDrugsByActiveSubstance',
    async (activeSubstanceId?: string) => {
        const response = await getDrugs();
        return response.data;
    }
);

export default drugsSlice.reducer;
