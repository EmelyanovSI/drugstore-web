import React, { useState } from 'react';
import {
    AppBar,
    Badge,
    Box,
    Checkbox,
    CssBaseline,
    Fab,
    IconButton,
    LinearProgress,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import { Favorite, FavoriteBorder, FavoriteBorderTwoTone } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchCountries } from '../redux/countriesSlice';
import { toggleTheme } from '../redux/themeSlice';
import headerTheme from '../theme/headerTheme';
import {
    addDrugsToFavorite,
    markAllDrugsAsDeselected,
    removeDrugsFromFavorite,
    selectIsAnyFavoriteInSelected,
    selectIsAllSelectedAreFavorite,
    selectSelectedDrugsCount,
    selectSelectedDrugsIsEmpty,
    setGroupBy,
    toggleReadonly,
    markDrugAsDeselected,
    removeDrugFromFavorite
} from '../redux/appSlice';
import { fetchDrugs, fetchDrugsByCountry, fetchDrugsByIds } from '../redux/drugsSlice';
import ElevationScroll from '../components/ElevationScroll';
import ScrollTo from '../components/ScrollTo';
import ChipNav from '../components/ChipNav/ChipNav';
import { GroupBy, ThemeMode } from '../constants/enums';
import CreateDrugDialog from '../components/CreateDrugDialog';
import { deleteDrug } from '../services/drugs.service';

interface Props {
    loadingDrugs: boolean;
}

const Header: React.FC<Props> = ({ loadingDrugs }: Props) => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector<ThemeMode>((state) => state.themeReducer.mode);
    const selectedCountryId = useAppSelector<string>((state) => state.appReducer.selectedCountryId);
    const favoriteDrugsIds = useAppSelector<Array<string>>((state) => state.appReducer.favoriteDrugsIds);
    const selectedDrugsIds = useAppSelector<Array<string>>((state) => state.appReducer.selectedDrugsIds);
    const groupBy = useAppSelector<GroupBy>((state) => state.appReducer.groupBy);
    const readonly = useAppSelector<boolean>((state) => state.appReducer.readonly);
    const selectedDrugsIsEmpty = useAppSelector(selectSelectedDrugsIsEmpty);
    const selectedDrugsCount = useAppSelector<number>(selectSelectedDrugsCount);
    const isAnyFavoriteInSelected = useAppSelector(selectIsAnyFavoriteInSelected);
    const isAllSelectedAreFavorite = useAppSelector(selectIsAllSelectedAreFavorite);

    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);

    const handleThemeModeChange = () => {
        dispatch(toggleTheme());
    };

    const handleRefresh = () => {
        dispatch(fetchCountries());
        switch (groupBy) {
            case GroupBy.All: {
                dispatch(fetchDrugs());
                break;
            }
            case GroupBy.Country: {
                dispatch(fetchDrugsByCountry(selectedCountryId));
                break;
            }
            case GroupBy.Similar: {
                dispatch(setGroupBy(GroupBy.All));
                break;
            }
            case GroupBy.Favorite: {
                dispatch(fetchDrugsByIds(favoriteDrugsIds));
                break;
            }
        }
    };

    const handleClearSelection = () => {
        dispatch(markAllDrugsAsDeselected());
    };

    const handleFavorite = () => {
        if (isAllSelectedAreFavorite) {
            dispatch(removeDrugsFromFavorite());
        } else {
            dispatch(addDrugsToFavorite());
        }
    };

    const handleReadonly = () => {
        dispatch(toggleReadonly());
    };

    const handleDelete = () => {
        selectedDrugsIds.forEach(drugId => {
            deleteDrug(drugId).then(() => {
                dispatch(markDrugAsDeselected(drugId));
                dispatch(removeDrugFromFavorite(drugId));
            });
        });
    };

    const handleCreate = () => {
        setIsOpenAddDialog(true);
    };

    const handleCloseCreation = () => {
        setIsOpenAddDialog(false);
    };

    return (
        <>
            <CssBaseline />
            <ElevationScroll>
                <AppBar color="inherit">
                    <Toolbar>
                        <Typography variant="h6" sx={{ mr: 1 }}>Drugstore</Typography>
                        <ChipNav />
                        <Stack direction="row" spacing={3} sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Tooltip title="Refresh">
                                    <IconButton onClick={handleRefresh}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                {selectedDrugsIsEmpty ? (
                                    !readonly && (
                                        <Tooltip title="Add">
                                            <IconButton onClick={handleCreate}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                ) : (
                                    <Tooltip title="Clear selection">
                                        <IconButton onClick={handleClearSelection}>
                                            <Badge badgeContent={selectedDrugsCount} color="success">
                                                <CloseIcon />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {!selectedDrugsIsEmpty && (
                                    <Tooltip title="Delete selection">
                                        <IconButton onClick={handleDelete}>
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Tooltip title="Readonly">
                                    <Checkbox
                                        size="small"
                                        icon={<EditOffOutlinedIcon />}
                                        checkedIcon={<EditOffIcon />}
                                        checked={readonly}
                                        onChange={handleReadonly}
                                    />
                                </Tooltip>
                                {!selectedDrugsIsEmpty && (
                                    <Tooltip title="Favorite">
                                        <Checkbox
                                            color="error"
                                            size="small"
                                            icon={<FavoriteBorder />}
                                            checkedIcon={<Favorite />}
                                            indeterminateIcon={<FavoriteBorderTwoTone />}
                                            checked={isAllSelectedAreFavorite}
                                            indeterminate={!isAllSelectedAreFavorite && isAnyFavoriteInSelected}
                                            onChange={handleFavorite}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Tooltip title={`${mode === 'light' ? 'Dark' : 'Light'} mode`}>
                                    <Checkbox
                                        size="small"
                                        icon={<DarkModeOutlinedIcon />}
                                        checkedIcon={<LightModeIcon />}
                                        checked={mode === 'dark'}
                                        onChange={handleThemeModeChange}
                                    />
                                </Tooltip>
                            </Box>
                        </Stack>
                    </Toolbar>
                    {loadingDrugs ? <LinearProgress color="success" /> : null}
                </AppBar>
            </ElevationScroll>
            <Toolbar id="back-to-top-anchor" />
            <ScrollTo elementId="back-to-top-anchor">
                <Tooltip title="Scroll to top">
                    <Fab size="small">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </Tooltip>
            </ScrollTo>
            <CreateDrugDialog open={isOpenAddDialog} handleClose={handleCloseCreation} />
        </>
    );
};

export default headerTheme(Header);
