import React from 'react';
import {
    AppBar,
    Box,
    Chip,
    CssBaseline,
    Fab,
    Fade,
    IconButton,
    Skeleton,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { CountriesState } from '../redux/countriesSlice';
import { toggleTheme } from '../redux/themeSlice';
import headerTheme from '../theme/headerTheme';

interface Props {
    children: React.ReactElement;
}

const ElevationScroll: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0
    });
};

const ScrollTop: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const trigger = useScrollTrigger({
        threshold: 50
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (
            (event.target as HTMLDivElement).ownerDocument || document
        ).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ block: 'center' });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Fade>
    );
};

const ChipList: React.FC<CountriesState> = ({ loading, error, countries }: CountriesState) => {
    const allChip = (
        <Tab label={
            <Chip
                label="All"
                variant={'outlined'}
                size={'small'}
            />
        } />
    );

    if (loading) {
        return (
            <Tabs sx={{ flexGrow: 1 }}>
                {allChip}
                {Array.from(Array(10).keys()).map((value) => (
                    <Tab key={value} label={
                        <Skeleton
                            variant="text"
                            animation={'wave'}
                            sx={{ mr: 1, height: 44, width: 64, borderRadius: 4 }}
                        />
                    } />
                ))}
            </Tabs>
        );
    }

    if (error) {
        return (
            <Tabs sx={{ flexGrow: 1 }}>
                {allChip}
            </Tabs>
        );
    }

    if (!countries.length) {
        return (
            <Tabs sx={{ flexGrow: 1 }}>
                {allChip}
            </Tabs>
        );
    }

    return (
        <Tabs sx={{ flexGrow: 1 }}>
            {allChip}
            {countries.map((value, index) => (
                <Tab key={index} label={
                    <Chip
                        label={value.name}
                        variant={'outlined'}
                        size={'small'}
                    />
                } />
            ))}
        </Tabs>
    );
};

const CustomizationPanel: React.FC<CountriesState> = ({ loading, error, countries }: CountriesState) => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(state => state.themeReducer.mode);

    const handleThemeModeChange = () => {
        dispatch(toggleTheme());
    };

    return (
        <>
            <CssBaseline />
            <ElevationScroll>
                <AppBar color={'inherit'}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ marginRight: 1 }}>Drugstore</Typography>
                        <ChipList loading={loading} error={error} countries={countries} />
                        <Box sx={{ mr: 3, display: { xs: 'none', md: 'flex' } }}>
                            <IconButton
                                size="small"
                                color="inherit"
                                onClick={handleThemeModeChange}
                                sx={{ ml: 1 }}
                            >
                                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar id="back-to-top-anchor" />
            <ScrollTop>
                <Fab size="small">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </>
    );
};

export default headerTheme(CustomizationPanel);
