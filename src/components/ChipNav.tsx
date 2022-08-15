import React, { useState } from 'react';
import { Badge, Chip, Divider, Stack, Tab } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectFavoriteDrugsCount, selectFavoriteDrugsIsEmpty, setGroupBy } from '../redux/appSlice';
import ChipList from './ChipList';
import { CountryChip } from './CountryChip';
import { GroupBy } from '../constants/enum';

const ChipNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const groupBy = useAppSelector(state => state.appReducer.groupBy);
    const favoriteDrugsIsEmpty = useAppSelector(selectFavoriteDrugsIsEmpty);
    const favoriteDrugsCount = useAppSelector(selectFavoriteDrugsCount);

    const [prevGroupBy, setPrevGroupBy] = useState(groupBy);

    const handleSelectFavorite = () => {
        if (groupBy === GroupBy.Favorite) {
            dispatch(setGroupBy(prevGroupBy));
        } else {
            setPrevGroupBy(groupBy);
            dispatch(setGroupBy(GroupBy.Favorite));
        }
    };

    return (
        <>
            <ChipList />
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="row" sx={{ flexGrow: 1 }}>
                <Tab label={
                    <Chip
                        label="Similar"
                        variant="outlined"
                        size="small"
                        clickable
                        disabled
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
