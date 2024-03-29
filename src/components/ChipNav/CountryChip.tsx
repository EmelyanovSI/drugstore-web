import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
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

export const SimilarChip: React.FC<Props> = (props: Props) => {
    const { checked, onClick } = props;

    if (checked) {
        return (
            <UncheckedCountryChip variant="filled" onDelete={onClick} {...props} />
        );
    }

    return (
        <UncheckedCountryChip disabled {...props} />
    );
};

export const AddChip: React.FC<Props> = (props: Props) => {
    const { checked, onClick, onDelete } = props;

    if (checked) {
        return (
            <UncheckedCountryChip
                variant="filled"
                onDelete={onDelete}
                icon={<DoneIcon />}
                {...props}
            />
        );
    }

    return (
        <UncheckedCountryChip
            variant="outlined"
            onDelete={onClick}
            deleteIcon={<AddIcon />}
            {...props}
        />
    );
};
