import React from 'react';
import {
    Autocomplete,
    Box,
    CardHeader,
    Chip,
    CircularProgress,
    InputBase,
    TextField
} from '@mui/material';

import { correctName } from '../../utils';
import { useAppSelector } from '../../redux/store';
import { Country } from '../../interfaces/countries.interface';
import { Message } from '../../constants/types';
import { Status } from '../../constants/enums';
import { CountryChip } from '../ChipNav/CountryChip';

interface State {
    message: Message;
    status: Status;
}

interface CommonHeaderProps {
    children?: JSX.Element & React.ReactNode;
    drug: string;
    country: string;
}

interface StaticHeaderProps extends CommonHeaderProps {
    alt?: JSX.Element & React.ReactNode;
}

interface DynamicHeaderProps extends StaticHeaderProps {
    countries: Array<Country>;
}

interface DrugCardHeaderProps extends State, CommonHeaderProps {
    isEdit: boolean;
}

const CardHeaderStatic: React.FC<StaticHeaderProps> = (props: StaticHeaderProps) => {
    const { children, drug, country, alt } = props;

    const title = correctName(drug);
    const subheader = alt ?? (
        <Chip
            label={correctName(country)}
            size="small"
            variant="outlined"
            color="success"
        />
    );

    return (
        <CardHeader
            {...{ title, subheader }}
            action={children}
        />
    );
};

const CardHeaderDynamic: React.FC<DynamicHeaderProps> = (props: DynamicHeaderProps) => {
    const { children, drug, country, countries, alt } = props;

    const title = (
        <InputBase
            name="drug"
            placeholder="Drug name"
            value={drug}
        />
    );
    const subheader = alt ?? (
        <Autocomplete
            options={countries}
            autoHighlight
            size="small"
            defaultValue={countries.find(({ name }) => name === country)}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
                return (
                    <Box component="li" {...props}>
                        <CountryChip
                            label={option.name}
                            checked={option.name === country}
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
        status,
        message,
        ...other
    } = props;

    const countries = useAppSelector<Array<Country>>((state) => state.countriesReducer.countries);

    const loading = <CircularProgress size={18} color="success" />;
    const error = (
        <Chip
            label={message}
            size="small"
            variant="filled"
            color="error"
        />
    );

    const dynamicHeader = (alt?: JSX.Element & React.ReactNode) => (
        <CardHeaderDynamic {...other} {...{ countries, alt }}>
            {children}
        </CardHeaderDynamic>
    );

    const staticHeader = (alt?: JSX.Element & React.ReactNode) => (
        <CardHeaderStatic {...other} alt={alt}>
            {children}
        </CardHeaderStatic>
    );

    if (isEdit) {
        switch (status) {
            case Status.Idle:
            case Status.Loading: {
                return dynamicHeader(loading);
            }
            case Status.Failed: {
                return dynamicHeader(error);
            }
            case Status.Succeeded:
            default: {
                return dynamicHeader();
            }
        }
    }

    switch (status) {
        case Status.Idle:
        case Status.Loading: {
            return staticHeader(loading);
        }
        case Status.Failed: {
            return staticHeader(error);
        }
        case Status.Succeeded:
        default: {
            return staticHeader();
        }
    }
};

export default DrugCardHeader;
