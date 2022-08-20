import React from 'react';
import { Autocomplete, Box, CardHeader, Chip, CircularProgress, InputBase, TextField } from '@mui/material';

import { correctName } from '../../utils';
import { selectCountriesIsEmpty } from '../../redux/countriesSlice';
import { useAppSelector } from '../../redux/store';
import { CountriesState } from '../../redux/state';
import { Message } from '../../constants/types';
import { Status } from '../../constants/enums';
import { CountryChip } from '../ChipNav/CountryChip';

interface SubheaderProps {
    children?: JSX.Element & React.ReactNode;
    message: Message;
    status: Status;
}

interface CommonHeaderProps extends SubheaderProps {
    drug: string;
    country?: string;
}

interface DynamicHeaderProps extends CommonHeaderProps {
    list: CountriesState & { isEmpty: boolean };
}

interface DrugCardHeaderProps extends CommonHeaderProps {
    isEdit: boolean;
}

const Subheader: React.FC<SubheaderProps> = (props: SubheaderProps) => {
    const { status, message, children } = props;

    if ([Status.Idle, Status.Loading].includes(status)) {
        return (
            <CircularProgress size={16} color="success" />
        );
    }

    if ([Status.Failed].includes(status)) {
        return (
            <Chip
                label={message}
                size="small"
                variant="filled"
                color="error"
            />
        );
    }

    return children ?? null;
};

const CardHeaderStatic: React.FC<CommonHeaderProps> = (props: CommonHeaderProps) => {
    const { children, drug, country, ...other } = props;

    const title = correctName(drug);
    const subheader = (
        <Subheader {...other}>
            {country ? (
                <Chip
                    label={correctName(country)}
                    size="small"
                    variant="outlined"
                    color="success"
                />
            ) : undefined}
        </Subheader>
    );

    return (
        <CardHeader
            {...{ title, subheader }}
            action={children}
        />
    );
};

const CardHeaderDynamic: React.FC<DynamicHeaderProps> = (props: DynamicHeaderProps) => {
    const {
        children,
        drug,
        list,
        ...other
    } = props;
    const { status, message, isEmpty, countries } = list;

    const title = (
        <InputBase
            name="drug"
            placeholder="Drug name"
            value={drug}
        />
    );
    const subheader = (
        <Subheader message={other.message || message} status={other.status || status}>
            {other.country ? (
                <Autocomplete
                    options={countries}
                    autoHighlight
                    size="small"
                    defaultValue={countries.find(({ name }) => name === other.country)}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => {
                        return (
                            <Box component="li" {...props}>
                                <CountryChip
                                    label={option.name}
                                    checked={option.name === other.country}
                                />
                            </Box>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Country"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
            ) : undefined}
        </Subheader>
    );

    return (
        <CardHeader
            {...{ title, subheader }}
            action={children}
        />
    );
};

const DrugCardHeader: React.FC<DrugCardHeaderProps> = (props: DrugCardHeaderProps) => {
    const {
        children,
        isEdit,
        ...other
    } = props;

    const countriesState = useAppSelector<CountriesState>((state) => state.countriesReducer);
    const isEmpty = useAppSelector(selectCountriesIsEmpty);

    if (isEdit) {
        return (
            <CardHeaderDynamic {...other} list={{ ...countriesState, isEmpty }}>
                {children}
            </CardHeaderDynamic>
        );
    }

    return (
        <CardHeaderStatic {...other}>
            {children}
        </CardHeaderStatic>
    );
};

export default DrugCardHeader;
