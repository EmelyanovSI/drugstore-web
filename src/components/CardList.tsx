import React from 'react';
import { Alert, AlertTitle, Grid, Skeleton, Stack } from '@mui/material';

import DrugCard from '../components/DrugCard';
import { Drug } from '../interfaces/drugs.interface';
import { DrugsState } from '../redux/drugsSlice';
import { useAppSelector } from '../redux/store';

const CardList: React.FC<DrugsState> = ({ loading, error, drugs }: DrugsState) => {
    const drugsSkeletonCount = useAppSelector(state => state.appReducer.drugsSkeletonCount);
    if (loading) {
        return (
            <Grid container spacing={4} padding={2}>
                {Array.from(Array(drugsSkeletonCount)).map((_, index) => (
                    <Grid item key={index}>
                        <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={210} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" width={210} height={60} />
                            <Skeleton variant="rectangular" width={210} height={60} />
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid padding={2}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {error} — <strong>try again later!</strong>
                </Alert>
            </Grid>
        );
    }

    if (!drugs.length) {
        return (
            <Grid padding={2}>
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    Drugs not found — <strong>create one yourself!</strong>
                </Alert>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} padding={2}>
            {drugs.map((drug: Drug, index: number) => (
                <Grid item key={drug._id}>
                    <DrugCard drug={drug} number={index} />
                </Grid>
            ))}
        </Grid>
    );
};

export default CardList;
