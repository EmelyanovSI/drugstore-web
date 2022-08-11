import React, { useEffect } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchDrugs, fetchDrugsByCountry, selectDrugsCount, selectDrugsIsEmpty } from '../redux/drugsSlice';
import { fetchCountries, selectCountriesCount, selectCountriesIsEmpty } from '../redux/countriesSlice';
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
    const countriesIsEmpty = useAppSelector(selectCountriesIsEmpty);
    const drugsIsEmpty = useAppSelector(selectDrugsIsEmpty);
    const drugsCount = useAppSelector(selectDrugsCount);
    const countriesCount = useAppSelector(selectCountriesCount);

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
        countriesIsEmpty && dispatch(fetchCountries());
        selectedCountry ? dispatch(fetchDrugsByCountry(selectedCountry._id)) : dispatch(fetchDrugs());
    }, [dispatch, countriesIsEmpty, selectedCountry]);

    useEffect(() => {
        !drugsIsEmpty && dispatch(updateDrugsSkeletonCount(drugsCount));
        !countriesIsEmpty && dispatch(updateCountriesSkeletonCount(countriesCount));
    }, [dispatch, drugsIsEmpty, countriesIsEmpty, drugsCount, countriesCount]);

    return (
        <Box>
            <CustomizationPanel
                countries={countries}
                loading={loadingCountries}
                loadingDrugs={loadingDrugs}
                error={errorCountries}
            />
            <CardList
                drugs={drugs}
                loading={loadingDrugs}
                error={errorDrugs}
            />

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
