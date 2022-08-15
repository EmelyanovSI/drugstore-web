import React from 'react';
import { Skeleton, Tab, Tabs } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { CountriesState, selectCountriesIsEmpty } from '../redux/countriesSlice';
import { setSelectedCountry, setGroupBy } from '../redux/appSlice';
import { CountryChip } from './CountryChip';
import { GroupBy } from '../constants/enum';

const ChipList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, error, countries }: CountriesState = useAppSelector(state => state.countriesReducer);
    const selectedCountryId = useAppSelector(state => state.appReducer.selectedCountryId);
    const countriesCount = useAppSelector(state => state.appReducer.countriesCount);
    const groupBy = useAppSelector(state => state.appReducer.groupBy);
    const countriesIsEmpty = useAppSelector(selectCountriesIsEmpty);
    const countriesSkeletonKeys = Array.from(Array(countriesCount).keys());

    const handleSelectGroupBy = (groupBy: GroupBy) => {
        dispatch(setGroupBy(groupBy));
    };

    const handleSelectCountry = (countryId?: string | null) => {
        if (groupBy === GroupBy.Country && selectedCountryId === countryId) {
            handleSelectGroupBy(GroupBy.All);
            dispatch(setSelectedCountry(null));
        } else {
            handleSelectGroupBy(GroupBy.Country);
            dispatch(setSelectedCountry(countryId));
        }
    };

    const AllChip: React.FC = () => (
        <CountryChip
            label="All"
            checked={groupBy === GroupBy.All}
            onClick={() => handleSelectGroupBy(GroupBy.All)}
        />
    );

    if (loading) {
        return (
            <Tabs>
                <Tab label={<AllChip />} />
                {countriesSkeletonKeys.map(key => (
                    <Tab key={key} label={
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ mr: 1, height: 44, width: 64, borderRadius: 4 }}
                        />
                    } />
                ))}
            </Tabs>
        );
    }

    if (error) {
        return (
            <Tabs>
                <Tab label={<AllChip />} />
                <Tab label={
                    <CountryChip
                        label={error}
                        checked={true}
                        color="error"
                        disabled
                    />
                } />
            </Tabs>
        );
    }

    if (countriesIsEmpty) {
        return (
            <Tabs>
                <Tab label={<AllChip />} />
                <Tab label={
                    <CountryChip
                        label="Countries not found"
                        checked={true}
                        color="warning"
                        disabled
                    />
                } />
            </Tabs>
        );
    }

    return (
        <Tabs>
            <Tab label={<AllChip />} />
            {countries.map(({ _id, name }) => (
                <Tab key={_id} label={
                    <CountryChip
                        label={name}
                        checked={groupBy === GroupBy.Country && selectedCountryId === _id}
                        onClick={() => handleSelectCountry(_id)}
                    />
                } />
            ))}
        </Tabs>
    );
};

export default ChipList;
