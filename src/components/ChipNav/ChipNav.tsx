import React, { useState } from 'react';
import { Badge, Divider, Stack, Tab } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { selectFavoriteDrugsCount, selectFavoriteDrugsIsEmpty, setGroupBy } from '../../redux/appSlice';
import ChipList from './ChipList';
import { CountryChip, SimilarChip } from './CountryChip';
import { GroupBy } from '../../constants/enums';

const ChipNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const groupBy = useAppSelector<GroupBy>((state) => state.appReducer.groupBy);
    const favoriteDrugsIsEmpty = useAppSelector(selectFavoriteDrugsIsEmpty);
    const favoriteDrugsCount = useAppSelector<number>(selectFavoriteDrugsCount);

    const [prevGroupBy, setPrevGroupBy] = useState(groupBy);

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
            </Stack>
        </>
    );
};

export default ChipNav;
