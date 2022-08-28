import { createSlice } from '@reduxjs/toolkit';

import { ThemeState } from './state';
import { ThemeMode } from '../constants/enums';

const { Dark, Light } = ThemeMode;

const initialState: ThemeState = {
    mode: Light
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: state => {
            state.mode = state.mode === Light ? Dark : Light;
        }
    }
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
