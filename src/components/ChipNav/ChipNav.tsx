import React, { useState } from 'react';
import { Badge, Box, Divider, InputBase, Stack, Tab, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { selectFavoriteDrugsCount, selectFavoriteDrugsIsEmpty, setGroupBy } from '../../redux/appSlice';
import ChipList from './ChipList';
import { AddChip, CountryChip, SimilarChip } from './CountryChip';
import { GroupBy } from '../../constants/enums';
import { nameValidationSchema } from '../../utils';
import { createCountry } from '../../services/countries.service';
import { addCountry } from '../../redux/countriesSlice';

const ChipNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const groupBy = useAppSelector<GroupBy>((state) => state.appReducer.groupBy);
    const favoriteDrugsIsEmpty = useAppSelector(selectFavoriteDrugsIsEmpty);
    const favoriteDrugsCount = useAppSelector<number>(selectFavoriteDrugsCount);

    const [prevGroupBy, setPrevGroupBy] = useState(groupBy);

    const [isEdit, setIsEdit] = useState(false);

    const {
        values,
        errors,
        isValid,
        handleChange,
        handleSubmit,
        handleReset
    } = useFormik({
        initialValues: {
            country: ''
        },
        validationSchema: Yup.object({
            country: nameValidationSchema()
        }),
        onSubmit: values => {
            createCountry({ name: values.country }).then(response => {
                dispatch(addCountry(response.data));
                setIsEdit(!isEdit);
            });
        }
    });

    const handleSelectFavorite = () => {
        if (groupBy === GroupBy.Favorite) {
            dispatch(setGroupBy(prevGroupBy));
        } else {
            setPrevGroupBy(groupBy);
            dispatch(setGroupBy(GroupBy.Favorite));
        }
    };

    const handleSelectSimilar = () => {
        dispatch(setGroupBy(GroupBy.All));
    };

    const handleNewCountry = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleReset(event);
        setIsEdit(!isEdit);
    };

    const handleAddCountry = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isEdit) {
            handleSubmit();
        } else {
            handleNewCountry(event);
        }
    };

    return (
        <>
            <ChipList />
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="row" sx={{ flexGrow: 1 }}>
                <Tab label={
                    <SimilarChip
                        label="Similar"
                        checked={groupBy === GroupBy.Similar}
                        onClick={handleSelectSimilar}
                    />
                } />
                <Tab sx={{ pr: 2 }} label={
                    <Badge
                        badgeContent={favoriteDrugsCount}
                        color="error"
                    >
                        <CountryChip
                            label="Favorite"
                            checked={groupBy === GroupBy.Favorite}
                            disabled={favoriteDrugsIsEmpty}
                            onClick={handleSelectFavorite}
                        />
                    </Badge>
                } />
                <Tab label={
                    <Tooltip title={isEdit ? errors.country ?? 'Add' : 'New'}>
                        <Box>
                            <AddChip
                                label={isEdit ? 'Add' : 'New'}
                                color={isValid ? 'default' : 'error'}
                                checked={isEdit}
                                onClick={handleAddCountry}
                                onDelete={handleNewCountry}
                            />
                        </Box>
                    </Tooltip>
                } />
                {isEdit && (
                    <InputBase
                        sx={{  minWidth: 100 }}
                        name="country"
                        placeholder="Country"
                        value={values.country}
                        onChange={handleChange}
                    />
                )}
            </Stack>
        </>
    );
};

export default ChipNav;
