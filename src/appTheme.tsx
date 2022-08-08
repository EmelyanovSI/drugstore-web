import React, { ComponentType } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { darkScrollbar } from '@mui/material';

import { useAppSelector } from './redux/store';

export default function appTheme<T>(Component: ComponentType<T>) {
    return (props: T) => {
        const mode = useAppSelector(state => state.themeReducer.mode);

        const lightTheme = createTheme({
            palette: {
                mode: 'light'
            }
        });

        const darkTheme = createTheme({
            palette: {
                mode: 'dark'
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: darkScrollbar()
                    }
                }
            }
        });

        return (
            <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
                <Component{...props as T} />
            </ThemeProvider>
        );
    };
}
