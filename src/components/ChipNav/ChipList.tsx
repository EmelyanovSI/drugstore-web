import React from 'react';
import { Skeleton, Tab, Tabs } from '@mui/material';

import { CountryChip } from './CountryChip';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectCountriesIsEmpty } from '@/redux/countriesSlice';
import { setGroupBy, setSelectedCountry } from '@/redux/appSlice';
import { CountriesState } from '@/redux/state';
import { GroupBy, Status } from '@/constants/enums';

const ChipList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { status, message, countries } = useAppSelector<CountriesState>((state) => state.countriesReducer);
    const selectedCountryId = useAppSelector<string>((state) => state.appReducer.selectedCountryId);
    const countriesCount = useAppSelector<number>((state) => state.appReducer.countriesCount);
    const groupBy = useAppSelector<GroupBy>((state) => state.appReducer.groupBy);
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

    if (status === Status.Loading) {
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

    if (status === Status.Failed) {
        return (
            <Tabs>
                <Tab label={<AllChip />} />
                <Tab label={
                    <CountryChip
                        label={message}
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
