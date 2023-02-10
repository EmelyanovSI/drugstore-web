import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { AppState } from './state';

import { GroupBy } from '@/constants/enums';

const initialState: AppState = {
    selectedDrugsIds: [],
    favoriteDrugsIds: [],
    selectedCountryId: null,
    countriesCount: 10,
    drugsCount: 10,
    readonly: false,
    groupBy: GroupBy.All
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        markDrugAsSelected(state, action) {
            state.selectedDrugsIds.push(action.payload);
        },
        markDrugAsDeselected(state, action) {
            state.selectedDrugsIds = state.selectedDrugsIds.filter(id => id !== action.payload);
        },
        markAllDrugsAsDeselected(state) {
            state.selectedDrugsIds = [];
        },
        setSelectedCountry(state, action) {
            state.selectedCountryId = action.payload;
        },
        setCountriesCount(state, action) {
            state.countriesCount = action.payload;
        },
        setDrugsCount(state, action) {
            state.drugsCount = action.payload;
        },
        addDrugToFavorite(state, action) {
            state.favoriteDrugsIds.push(action.payload);
        },
        addDrugsToFavorite(state) {
            let selectedDrugsIds = state.selectedDrugsIds;
            state.favoriteDrugsIds.forEach(favoriteDrugId => {
                selectedDrugsIds = selectedDrugsIds.filter(selectedDrugId => selectedDrugId !== favoriteDrugId);
            });
            state.favoriteDrugsIds = state.favoriteDrugsIds.concat(selectedDrugsIds);
        },
        removeDrugFromFavorite(state, action) {
            state.favoriteDrugsIds = state.favoriteDrugsIds.filter(id => id !== action.payload);
        },
        removeDrugsFromFavorite(state) {
            let favoriteDrugsIds = state.favoriteDrugsIds;
            state.selectedDrugsIds.forEach(selectedDrugId => {
                favoriteDrugsIds = favoriteDrugsIds.filter(favoriteDrugId => favoriteDrugId !== selectedDrugId);
            });
            state.favoriteDrugsIds = favoriteDrugsIds;
        },
        setGroupBy(state, action) {
            state.groupBy = action.payload;
        },
        toggleReadonly(state) {
            state.readonly = !state.readonly;
        }
    }
});

export const selectSelectedDrugsCount = (state: RootState) => state.appReducer.selectedDrugsIds.length;
export const selectSelectedDrugsIsEmpty = (state: RootState) => !state.appReducer.selectedDrugsIds.length;
export const selectIsDrugSelected = (drugId?: string) => (state: RootState) => (
    !!state.appReducer.selectedDrugsIds.find((id: string) => id === drugId)
);
export const selectFavoriteDrugsCount = (state: RootState) => state.appReducer.favoriteDrugsIds.length;
export const selectFavoriteDrugsIsEmpty = (state: RootState) => !state.appReducer.favoriteDrugsIds.length;
export const selectIsDrugFavorite = (drugId?: string) => (state: RootState) => (
    !!state.appReducer.favoriteDrugsIds.find((id: string) => id === drugId)
);
export const selectIsAnyFavoriteInSelected = (state: RootState) => {
    const drug = state.appReducer.selectedDrugsIds.find(
        (selectedDrugId: string) => {
            const drug = state.appReducer.favoriteDrugsIds.find(
                (favoriteDrugId: string) => selectedDrugId === favoriteDrugId
            );
            return !!drug;
        }
    );
    return !!drug;
};
export const selectIsAllSelectedAreFavorite = (state: RootState) => {
    for (const selectedDrugId of state.appReducer.selectedDrugsIds) {
        const isInFavorite = !!state.appReducer.favoriteDrugsIds.find((id: string) => id === selectedDrugId);
        if (!isInFavorite) {
            return false;
        }
    }
    return true;
};

export const {
    markDrugAsSelected,
    markDrugAsDeselected,
    markAllDrugsAsDeselected,
    setSelectedCountry,
    setCountriesCount,
    setDrugsCount,
    addDrugToFavorite,
    addDrugsToFavorite,
    removeDrugFromFavorite,
    removeDrugsFromFavorite,
    setGroupBy,
    toggleReadonly
} = appSlice.actions;

export default appSlice.reducer;
