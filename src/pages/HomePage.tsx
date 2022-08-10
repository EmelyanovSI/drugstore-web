import React, { useEffect } from 'react';
import {
    Alert,
    Box,
    LinearProgress,
    Snackbar
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchDrugs, fetchDrugsByCountry } from '../redux/drugsSlice';
import { fetchCountries } from '../redux/countriesSlice';
import CustomizationPanel from '../components/CustomizationPanel';
import CardList from '../components/CardList';
import { updateCountriesSkeletonCount, updateDrugsSkeletonCount } from '../redux/appSlice';

const autoHideDuration = 6000;

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        loading: loadingDrugs,
        error: errorDrugs,
        drugs
    } = useAppSelector(state => state.drugsReducer);
    const {
        loading: loadingCountries,
        error: errorCountries,
        countries
    } = useAppSelector(state => state.countriesReducer);
    const selectedCountry = useAppSelector(state => state.appReducer.selectedCountry);

    const [openDrugs, setOpenDrugs] = React.useState(!!errorDrugs);
    const [openCountries, setOpenCountries] = React.useState(!!errorCountries);

    const handleCloseDrugs = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDrugs(false);
    };

    const handleCloseCountries = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenCountries(false);
    };

    useEffect(() => {
        countries.length || dispatch(fetchCountries());
        selectedCountry ? dispatch(fetchDrugsByCountry(selectedCountry._id)) : dispatch(fetchDrugs());
    }, [dispatch, selectedCountry]);

    useEffect(() => {
        drugs.length && dispatch(updateDrugsSkeletonCount(drugs.length));
        countries.length && dispatch(updateCountriesSkeletonCount(countries.length));
    }, [countries, drugs]);

    return (
        <Box>
            <CustomizationPanel countries={countries} loading={loadingCountries} error={errorCountries} />
            {loadingDrugs ? <LinearProgress color={'success'} /> : null}
            <CardList drugs={drugs} loading={loadingDrugs} error={errorDrugs} />

            <Snackbar open={openDrugs} autoHideDuration={autoHideDuration} onClose={handleCloseDrugs}>
                <Alert onClose={handleCloseDrugs} severity={'error'} sx={{ width: '100%' }}>
                    {errorDrugs}
                </Alert>
            </Snackbar>
            <Snackbar open={openCountries} autoHideDuration={autoHideDuration} onClose={handleCloseCountries}>
                <Alert onClose={handleCloseCountries} severity={'error'} sx={{ width: '100%' }}>
                    {errorCountries}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default HomePage;
