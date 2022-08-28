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
import { GroupBy, Status } from '../constants/enums';
import { CountriesState, DrugsState } from '../redux/state';

const autoHideDuration = 6000;

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const drugsList = useAppSelector<DrugsState>((state) => state.drugsReducer);
    const countriesList = useAppSelector<CountriesState>((state) => state.countriesReducer);
    const selectedCountryId = useAppSelector<string>((state) => state.appReducer.selectedCountryId);
    const favoriteDrugsIds = useAppSelector<Array<string>>((state) => state.appReducer.favoriteDrugsIds);
    const groupBy = useAppSelector<GroupBy>((state) => state.appReducer.groupBy);
    const countriesIsEmpty = useAppSelector(selectCountriesIsEmpty);
    const drugsIsEmpty = useAppSelector(selectDrugsIsEmpty);
    const drugsCount = useAppSelector<number>(selectDrugsCount);
    const countriesCount = useAppSelector<number>(selectCountriesCount);

    const [openAlert, setOpenAlert] = React.useState([drugsList.status, countriesList.status].includes(Status.Failed));

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
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
            <Header loadingDrugs={drugsList.status === Status.Loading} />
            <CardList {...drugsList} />

            <Snackbar open={openAlert} autoHideDuration={autoHideDuration} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={'error'} sx={{ width: '100%' }}>
                    {drugsList.message || countriesList.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default HomePage;
