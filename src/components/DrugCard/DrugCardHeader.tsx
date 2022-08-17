import React, { useState } from 'react';
import { Autocomplete, CardHeader, Chip, InputBase, TextField, Typography } from '@mui/material';

import { correctName } from '../../utils';
import { Substance } from '../../interfaces/substacne.interface';

interface CardHeaderProps {
    children?: JSX.Element & React.ReactNode;
    drugName: string;
    composition: Array<Substance>;
}

interface DrugCardHeaderProps extends CardHeaderProps {
    isEditMode: boolean;
}

const CardHeaderStatic: React.FC<CardHeaderProps> = (props: CardHeaderProps) => {
    const { children, drugName, composition } = props;

    const title = correctName(drugName);
    const subheader = composition.map(({ _id, name, activeSubstance }) => (
        <Typography key={_id} variant="body2">
            {activeSubstance ? <strong>{correctName(name)}</strong> : correctName(name)}
        </Typography>
    ));

    return (
        <CardHeader
            title={title}
            subheader={subheader}
            action={children}
        />
    );
};

const CardHeaderDynamic: React.FC<CardHeaderProps> = (props: CardHeaderProps) => {
    const {
        children,
        drugName,
        composition
    } = props;

    const [nameArray, setNameArray] = useState(composition.map(({ name }) => name));

    const title = (
        <InputBase
            name="drugName"
            placeholder="Drug name"
            value={drugName}
        />
    );

    const subheader = (
        <Autocomplete
            multiple
            freeSolo
            size="small"
            value={[...nameArray]}
            renderInput={params => (
                <TextField
                    {...params}
                    placeholder="Substance"
                />
            )}
            renderTags={(value, getTagProps) => value.map(
                (option, index) => {
                    return (
                        <Chip
                            size="small"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    );
                }
            )}
            onChange={(_, value) => {
                setNameArray(value);
            }}
            options={[]}
        />
    );

    return (
        <CardHeader
            title={title}
            subheader={subheader}
            action={children}
        />
    );
};

const DrugCardHeader: React.FC<DrugCardHeaderProps> = (props: DrugCardHeaderProps) => {
    const {
        children,
        isEditMode,
        drugName,
        composition,
        ...other
    } = props;

    if (isEditMode) {
        return (
            <CardHeaderDynamic {...other} drugName={drugName} composition={composition}>
                {children}
            </CardHeaderDynamic>
        );
    }

    return (
        <CardHeaderStatic drugName={drugName} composition={composition}>
            {children}
        </CardHeaderStatic>
    );
};

export default DrugCardHeader;
