import React from 'react';
import { correctName } from '../../utils';
import { CardHeader, InputBase, Typography } from '@mui/material';
import { Substance } from '../../interfaces/substacne.interface';

interface CardHeaderProps {
    drugName: string;
    composition: Array<Substance>;
    children?: JSX.Element & React.ReactNode;
}

interface DrugCardHeaderProps extends CardHeaderProps {
    isEditMode: boolean;
}

const CardHeaderStatic: React.FC<CardHeaderProps> = (props: CardHeaderProps) => {
    const { drugName, composition, children } = props;

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
    const { drugName, composition, children } = props;

    const title = (
        <InputBase
            placeholder="Drug name"
        />
    );
    const subheader = composition.map(({ _id, name, activeSubstance }) => (
        <Typography key={_id} variant="body2">
            {activeSubstance ? <strong>{name}</strong> : name}
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

const DrugCardHeader: React.FC<DrugCardHeaderProps> = (props: DrugCardHeaderProps) => {
    const { drugName, composition, isEditMode, children } = props;

    if (isEditMode) {
        return (
            <CardHeaderDynamic drugName={drugName} composition={composition}>
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
