import React from 'react';
import { Autocomplete, Box, CardHeader, Chip, CircularProgress, InputBase, TextField } from '@mui/material';

import { correctName } from '../../utils';
import { selectCountriesIsEmpty } from '../../redux/countriesSlice';
import { useAppSelector } from '../../redux/store';
import { CountriesState } from '../../redux/state';
import { Message } from '../../constants/types';
import { Status } from '../../constants/enums';

interface SubheaderProps {
    country?: string;
    message: Message;
    status: Status;
}

interface CommonHeaderProps extends SubheaderProps {
    children?: JSX.Element & React.ReactNode;
    drug: string;
}

interface DynamicHeaderProps extends CommonHeaderProps {
    list: CountriesState & { isEmpty: boolean };
}

interface DrugCardHeaderProps extends CommonHeaderProps {
    isEdit: boolean;
}

const Subheader: React.FC<SubheaderProps> = (props: SubheaderProps) => {
    const { status, message, country } = props;

    if ([Status.Idle, Status.Loading].includes(status) || !country) {
        return (
            <CircularProgress size={20} color="success" />
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

    return (
        <Chip
            label={correctName(country)}
            size="small"
            variant="outlined"
            color="success"
        />
    );
};

const CardHeaderStatic: React.FC<CommonHeaderProps> = (props: CommonHeaderProps) => {
    const { children, drug, ...other } = props;

    const title = correctName(drug);
    const subheader = <Subheader {...other} />;

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
        <Autocomplete
            options={countries}
            autoHighlight
            size="small"
            defaultValue={countries.find(({ name }) => name === other.country)}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
                return (
                    <Box component="li" {...props}>
                        <Chip label={option.name} clickable />
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
