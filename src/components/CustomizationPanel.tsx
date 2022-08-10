import React from 'react';
import {
    AppBar,
    Box,
    Checkbox,
    Chip,
    CssBaseline,
    Fab,
    Fade,
    IconButton,
    LinearProgress,
    Skeleton,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { CountriesState, fetchCountries } from '../redux/countriesSlice';
import { toggleTheme } from '../redux/themeSlice';
import headerTheme from '../theme/headerTheme';
import { clearDrugSelection, selectCountry } from '../redux/appSlice';
import { Country } from '../interfaces/countries.interface';
import { fetchDrugs, fetchDrugsByCountry } from '../redux/drugsSlice';

interface ScrollProps {
    children: React.ReactElement;
}

const ElevationScroll: React.FC<ScrollProps> = (props: ScrollProps) => {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0
    });
};

const ScrollTop: React.FC<ScrollProps> = (props: ScrollProps) => {
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
    const dispatch = useAppDispatch();
    const selectedCountry = useAppSelector(state => state.appReducer.selectedCountry);
    const countriesSkeletonCount = useAppSelector(state => state.appReducer.countriesSkeletonCount);

    const handleSelect = (country: Country | null) => {
        dispatch(selectCountry(country));
    };

    const allChip = (
        <Tab label={
            <Chip
                label="All"
                variant={selectedCountry ? 'outlined' : 'filled'}
                size={'small'}
                clickable
                onClick={() => handleSelect(null)}
                onDelete={selectedCountry ? undefined : () => handleSelect(null)}
                deleteIcon={selectedCountry ? undefined : <DoneIcon />}
            />
        } />
    );

    if (loading) {
        return (
            <Tabs sx={{ flexGrow: 1 }}>
                {allChip}
                {Array.from(Array(countriesSkeletonCount).keys()).map((value) => (
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
                        variant={selectedCountry && selectedCountry._id === value._id ? 'filled' : 'outlined'}
                        size={'small'}
                        clickable
                        onClick={() => handleSelect(value)}
                        onDelete={selectedCountry && selectedCountry._id === value._id ? () => handleSelect(value) : undefined}
                        deleteIcon={selectedCountry && selectedCountry._id === value._id ? <DoneIcon /> : undefined}
                    />
                } />
            ))}
        </Tabs>
    );
};

interface Props extends CountriesState {
    loadingDrugs: boolean;
}

const CustomizationPanel: React.FC<Props> = ({ loading, error, countries, loadingDrugs }: Props) => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(state => state.themeReducer.mode);
    const selectedCountry = useAppSelector(state => state.appReducer.selectedCountry);
    const selectedDrugs = useAppSelector(state => state.appReducer.selectedDrugs);

    const handleThemeModeChange = () => {
        dispatch(toggleTheme());
    };

    const handleRefresh = () => {
        dispatch(fetchCountries());
        selectedCountry ? dispatch(fetchDrugsByCountry(selectedCountry._id)) : dispatch(fetchDrugs());
    };

    const handleSelectCancellation = () => {
        dispatch(clearDrugSelection());
    };

    const handleDelete = () => {
        // TODO: delete selected drugs from DB & redux storage
    };

    const handleCreate = () => {
        // TODO: create card locally with empty fields
    };

    const button = selectedDrugs.length ? (
        <IconButton size="small" onClick={handleSelectCancellation}>
            <CloseIcon />
        </IconButton>
    ) : (
        <IconButton disabled size="small" onClick={handleCreate}>
            <AddIcon />
        </IconButton>
    );

    return (
        <>
            <CssBaseline />
            <ElevationScroll>
                <AppBar color={'inherit'}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ marginRight: 1 }}>Drugstore</Typography>
                        <ChipList loading={loading} error={error} countries={countries} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Box sx={{ mr: 3 }}>
                                <IconButton size="small" onClick={handleRefresh}>
                                    <RefreshIcon />
                                </IconButton>
                                {button}
                                {!!selectedDrugs.length &&
                                    <IconButton disabled size="small" onClick={handleDelete}>
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                }
                            </Box>
                            <Box sx={{ mr: 3 }}>
                                <Checkbox
                                    disabled
                                    size={'small'}
                                    icon={<EditOffOutlinedIcon />}
                                    checkedIcon={<EditOffIcon />}
                                />
                                <Checkbox
                                    size={'small'}
                                    icon={<DarkModeOutlinedIcon />}
                                    checkedIcon={<LightModeIcon />}
                                    checked={mode === 'dark'}
                                    onChange={handleThemeModeChange}
                                />
                            </Box>
                        </Box>
                    </Toolbar>
                    {loadingDrugs ? <LinearProgress color={'success'} /> : null}
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
