import React, { useState } from 'react';
import {
    Autocomplete,
    Box,
    CardHeader,
    Chip,
    CircularProgress,
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

interface StaticProps {
    children?: JSX.Element & React.ReactNode;
    drug: string;
    country: string;
}

interface DynamicProps {
    drugError?: string;
    countryError?: string;
    onChange: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface StaticHeaderProps extends StaticProps {
    alt?: JSX.Element & React.ReactNode;
}

interface DynamicHeaderProps extends StaticHeaderProps, DynamicProps {
    countries: Array<Country>;
}

interface DrugCardHeaderProps extends State, StaticProps, DynamicProps {
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
    const {
        children,
        drug,
        country,
        countries,
        alt,
        drugError,
        countryError,
        onChange
    } = props;

    const [inputValue, setInputValue] = useState(country);

    const handleDrugChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange('drug', event.target.value);
    };

    const handleCountryChange = (event: React.SyntheticEvent, value?: string | null) => {
        onChange('country', value);
    };

    const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const title = (
        <TextField
            size="small"
            margin="dense"
            label="Drug name"
            placeholder="Drug name"
            value={drug}
            error={!!drugError}
            helperText={drugError}
            onChange={handleDrugChange}
            onClick={handleStopPropagation}
            required
        />
    );
    const subheader = alt ?? (
        <Autocomplete
            autoHighlight
            size="small"
            options={countries.map(value => value.name)}
            value={country}
            inputValue={inputValue}
            onChange={handleCountryChange}
            onInputChange={(_, value) => setInputValue(value)}
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    <CountryChip
                        label={option}
                        checked={option === country}
                        onClick={() => {}}
                    />
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    margin="dense"
                    label="Country"
                    placeholder="Country"
                    error={!!countryError}
                    helperText={countryError}
                    onClick={handleStopPropagation}
                    required
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
    const { drug, country } = other;

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
        <CardHeaderStatic {...{ drug, country }} alt={alt}>
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
