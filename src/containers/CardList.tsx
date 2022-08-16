import React from 'react';
import { Alert, AlertTitle, Grid, Skeleton, Stack } from '@mui/material';

import DrugCard from '../components/DrugCard/DrugCard';
import { Drug } from '../interfaces/drugs.interface';
import { DrugsState, selectDrugsIsEmpty } from '../redux/drugsSlice';
import { useAppSelector } from '../redux/store';

const CardList: React.FC<DrugsState> = ({ loading, error, drugs }: DrugsState) => {
    const drugsIsEmpty = useAppSelector(selectDrugsIsEmpty);
    const drugsCount = useAppSelector(state => state.appReducer.drugsCount);
    const drugsSkeletonKeys = Array.from(Array(drugsCount).keys());

    if (loading) {
        return (
            <Grid container spacing={4} padding={2}>
                {drugsSkeletonKeys.map(key => (
                    <Grid item key={key}>
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

    if (drugsIsEmpty) {
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
