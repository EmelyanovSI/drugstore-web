import { createSlice } from '@reduxjs/toolkit';

import { Drug } from '../interfaces/drugs.interface';
import { Country } from '../interfaces/countries.interface';

export interface AppState {
    selectedDrugs: Array<Drug>;
    selectedCountry: Country | null;
}

const initialState: AppState = {
    selectedDrugs: [],
    selectedCountry: null
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        selectDrug(state, action) {
            state.selectedDrugs.push(action.payload);
        },
        unselectDrug(state, action) {
            state.selectedDrugs = state.selectedDrugs.filter(({ _id }) => _id !== action.payload._id);
        },
        clearDrugSelection(state) {
            state.selectedDrugs = [];
        },
        selectCountry(state, action) {
            state.selectedCountry = state.selectedCountry?._id === action.payload?._id ? null : action.payload;
        }
    }
});

export const { selectDrug, unselectDrug, clearDrugSelection, selectCountry } = appSlice.actions;

export default appSlice.reducer;
