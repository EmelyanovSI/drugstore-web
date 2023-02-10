import React, { ComponentType } from 'react';
import { Components, createTheme, Theme, ThemeProvider } from '@mui/material/styles';

import { useAppSelector } from '@/redux/store';

export default function headerTheme<T>(Component: ComponentType<T>) {
    return (props: T) => {
        const mode = useAppSelector(state => state.themeReducer.mode);

        const components: Components<Omit<Theme, 'components'>> | undefined = {
            MuiToolbar: {
                defaultProps: {
                    variant: 'dense'
                }
            },
            MuiTabs: {
                // TODO: horizontal scroll on mouse wheel without 'shift' key
                // TODO: border shadow on scroll (left/right side)
                styleOverrides: {
                    root: {
                        alignItems: 'center'
                        // minHeight: 0,
                    }
                },
                defaultProps: {
                    value: false,
                    scrollButtons: false,
                    variant: 'scrollable'
                }
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        cursor: 'default',
                        textTransform: 'none',
                        minWidth: 0,
                        // minHeight: 0,
                        padding: 0,
                        paddingLeft: 4,
                        paddingRight: 4
                    }
                },
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true
                }
            }
        };

        const lightTheme = createTheme({
            components,
            palette: {
                mode: 'light'
            }
        });

        const darkTheme = createTheme({
            components,
            palette: {
                mode: 'dark'
            }
        });

        return (
            <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
                <Component{...props as T} />
            </ThemeProvider>
        );
    };
}
