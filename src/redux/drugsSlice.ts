import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { RootState } from './store';
import { DrugsState } from './state';

import { Status } from '@/constants/enums';
import {
    getDrugs,
    getDrugsByActiveSubstance,
    getDrugsByCountry,
    getDrugsByIds
} from '@/services/drugs.service';

const initialState: DrugsState = {
    drugs: [],
    status: Status.Idle,
    message: null
};

export const drugsSlice = createSlice({
    name: 'drugs',
    initialState,
    reducers: {
        findAndUpdateDrug(state, action) {
            state.drugs = state.drugs.map((drug) => {
                if (drug._id === action.payload._id) {
                    return action.payload;
                }
                return drug;
            });
        }
    },
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
    const response = await getDrugsByIds(drugsIds);
    return response.data;
});

export const fetchDrugsByActiveSubstance = createAsyncThunk(
    'drugs/fetchDrugsByActiveSubstance',
    async (activeSubstance?: string) => {
        const response = await getDrugsByActiveSubstance(activeSubstance);
        return response.data;
    }
);

export const { findAndUpdateDrug } = drugsSlice.actions;

export default drugsSlice.reducer;
