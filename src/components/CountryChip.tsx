import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { Chip, ChipProps } from '@mui/material';

interface Props extends ChipProps {
    checked: boolean;
}

const UncheckedCountryChip: React.FC<ChipProps> = (props: ChipProps) => {
    return (
        <Chip
            variant="outlined"
            size="small"
            clickable
            {...props}
        />
    );
};

const CheckedCountryChip: React.FC<ChipProps> = (props: ChipProps) => {
    const { onClick } = props;

    return (
        <UncheckedCountryChip
            variant="filled"
            deleteIcon={<DoneIcon />}
            onDelete={onClick}
            {...props}
        />
    );
};

export const CountryChip: React.FC<Props> = (props: Props) => {
    const { checked } = props;

    if (checked) {
        return (
            <CheckedCountryChip {...props} />
        );
    }

    return (
        <UncheckedCountryChip {...props} />
    );
};
