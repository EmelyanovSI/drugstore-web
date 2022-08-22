import React from 'react';
import { CardActions, Chip } from '@mui/material';
import { DateTime } from 'luxon';

interface DrugCardFooterProps {
    children?: JSX.Element & React.ReactNode;
    cost?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const DrugCardFooter: React.FC<DrugCardFooterProps> = (props: DrugCardFooterProps) => {
    const { children, cost, createdAt, updatedAt } = props;

    const createdTime = createdAt ? DateTime.fromJSDate(createdAt) : null;
    const updatedTime = updatedAt ? DateTime.fromJSDate(updatedAt) : createdTime;
    const updatedTimeString = updatedTime?.toFormat('yyyy LLL dd');

    const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const costChip = cost ? (
        <Chip
            label={`$${cost}`}
            size="small"
            variant="outlined"
            color="success"
            onClick={handleStopPropagation}
        />
    ) : (
        <Chip
            label={'Cost not specified'}
            size="small"
            variant="outlined"
            color="warning"
            onClick={handleStopPropagation}
        />
    );

    const outdatedChip = updatedTimeString ? (
        <Chip
            label={updatedTimeString}
            size="small"
            variant="outlined"
            color="success"
            onClick={handleStopPropagation}
        />
    ) : null;

    return (
        <CardActions>
            {costChip}
            {outdatedChip}
            {children}
        </CardActions>
    );
};

export default DrugCardFooter;
