import React, { useEffect } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import {
    fetchDrugs,
    fetchDrugsByCountry,
    fetchDrugsByIds,
    selectDrugsCount,
    selectDrugsIsEmpty
} from '../redux/drugsSlice';
import { fetchCountries, selectCountriesCount, selectCountriesIsEmpty } from '../redux/countriesSlice';
import { setCountriesCount, setDrugsCount, setGroupBy } from '../redux/appSlice';
import Header from '../containers/Header';
import CardList from '../containers/CardList';
import { GroupBy } from '../constants/enum';

const autoHideDuration = 6000;

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        loading: loadingDrugs,
        error: errorDrugs,
        drugs
    } = useAppSelector(state => state.drugsReducer);
    const errorCountries = useAppSelector(state => state.countriesReducer.error);
    const selectedCountryId = useAppSelector(state => state.appReducer.selectedCountryId);
    const favoriteDrugsIds = useAppSelector(state => state.appReducer.favoriteDrugsIds);
    const groupBy = useAppSelector(state => state.appReducer.groupBy);
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
        switch (groupBy) {
            case GroupBy.All: {
                dispatch(fetchDrugs());
                break;
            }
            case GroupBy.Country: {
                dispatch(fetchDrugsByCountry(selectedCountryId));
                break;
            }
            case GroupBy.Similar: {
                drugsIsEmpty && dispatch(setGroupBy(GroupBy.All));
                break;
            }
        }
    }, [dispatch, groupBy, countriesIsEmpty, selectedCountryId, drugsIsEmpty]);

    useEffect(() => {
        if (groupBy === GroupBy.Favorite) {
            dispatch(fetchDrugsByIds(favoriteDrugsIds));
        }
    }, [dispatch, groupBy, favoriteDrugsIds]);

    useEffect(() => {
        !drugsIsEmpty && dispatch(setDrugsCount(drugsCount));
        !countriesIsEmpty && dispatch(setCountriesCount(countriesCount));
    }, [dispatch, drugsIsEmpty, countriesIsEmpty, drugsCount, countriesCount]);

    return (
        <Box>
            <Header loadingDrugs={loadingDrugs} />
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
