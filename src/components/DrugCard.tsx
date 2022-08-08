import React from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';

import { Drug } from '../interfaces/drugs.interface';

const DrugCard: React.FC<Drug> = (props: Drug) => {
    return (
        <Card sx={{ width: 345, margin: 1 }} variant="outlined">
            <CardHeader title={props.name} subheader={props.country} />
            <CardContent>
                {props.composition.map(({ _id, name }) => (
                    <Typography key={_id} variant="body2">{name}</Typography>
                ))}
            </CardContent>
            <CardActions></CardActions>
        </Card>
    );
};

export default DrugCard;
