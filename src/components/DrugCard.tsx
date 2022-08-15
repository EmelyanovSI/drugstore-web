import React, { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    CircularProgress,
    Fade,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { Drug } from '../interfaces/drugs.interface';
import { Country } from '../interfaces/countries.interface';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { getCountryById } from '../services/countries.service';
import { correctName } from '../utils';
import {
    addDrugToFavorite,
    removeDrugFromFavorite,
    markDrugAsSelected,
    selectIsDrugFavorite,
    selectIsDrugSelected,
    selectSelectedDrugsIsEmpty,
    markDrugAsDeselected
} from '../redux/appSlice';

type Props = {
    drug: Drug,
    number: number
}

const DrugCard: React.FC<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const {
        _id: drugId,
        name: drugName,
        country: countryId,
        composition,
        cost
    } = props.drug;
    const isSelected = useAppSelector(selectIsDrugSelected(drugId));
    const isFavorite = useAppSelector(selectIsDrugFavorite(drugId));
    const selectedDrugsIsEmpty = useAppSelector(selectSelectedDrugsIsEmpty);
    const [country, setCountry] = useState<Country | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [btnVisible, setBtnVisible] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [checked, setChecked] = useState(isSelected);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (countryId) {
            setLoading(true);
            getCountryById(countryId).then(value => {
                setCountry(value.data);
            }).catch(reason => {
                setError(reason.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [dispatch, countryId]);

    useEffect(() => {
        setChecked(isSelected);
    }, [isSelected]);

    const handleBadgeClick = () => {
        if (!showCheck && selectedDrugsIsEmpty) {
            return;
        }
        if (checked) {
            setChecked(false);
            dispatch(markDrugAsDeselected(drugId));
        } else {
            setChecked(true);
            dispatch(markDrugAsSelected(drugId));
        }
    };

    const handleFavoriteClick = () => {
        isFavorite
            ? dispatch(removeDrugFromFavorite(drugId))
            : dispatch(addDrugToFavorite(drugId));
    };

    const badgeContent = (
        <Box
            onMouseOver={() => setShowCheck(true)}
            onMouseOut={() => setShowCheck(false)}
        >
            {showCheck ? (
                <Tooltip title={checked ? 'Deselect' : 'Select'}>
                    <Box>{checked
                        ? <CloseIcon cursor="pointer" fontSize="inherit" />
                        : <CheckIcon cursor="pointer" fontSize="inherit" />
                    }</Box>
                </Tooltip>
            ) : props.number}
        </Box>
    );

    return (
        <Badge
            badgeContent={badgeContent}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            invisible={!btnVisible && !checked}
            color="success"
            onMouseOver={() => setBtnVisible(true)}
            onMouseOut={() => setBtnVisible(false)}
            onClick={handleBadgeClick}
            showZero
        >
            <Card
                sx={{ width: 345 }}
                variant={checked ? 'elevation' : 'outlined'}
                elevation={checked ? 8 : 0}
            >
                <CardHeader
                    title={correctName(drugName)}
                    subheader={composition.map((value) => (
                        <Typography key={value._id} variant="body2">
                            {correctName(value.name)}
                        </Typography>
                    ))}
                    action={
                        <Fade in={btnVisible}>
                            <Box>
                                {editMode &&
                                    <Tooltip title="Save">
                                        <IconButton onClick={() => setEditMode(!editMode)}>
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title={editMode ? 'Cancel' : 'Edit'}>
                                    <IconButton onClick={() => setEditMode(!editMode)}>
                                        {editMode ? <CloseIcon fontSize="small" /> : <ModeEditIcon
                                            fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Fade>
                    }
                />
                <CardContent>~ ${cost || '10'}</CardContent>
                <CardActions>
                    {loading && <CircularProgress size={20} color="success" />}
                    {error && (
                        <Alert variant="outlined" severity="error">
                            Country not found
                        </Alert>
                    )}
                    {country && (
                        <Chip
                            label={country.name}
                            size="small"
                            variant="outlined"
                            color="success"
                            clickable
                        />
                    )}
                    <Fade in={btnVisible}>
                        <Box style={{ marginLeft: 'auto' }}>
                            <Tooltip title="Similar">
                                <IconButton>
                                    <JoinInnerIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Favorite">
                                <Checkbox
                                    color="error"
                                    size="small"
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite />}
                                    checked={isFavorite}
                                    onClick={handleFavoriteClick}
                                />
                            </Tooltip>
                        </Box>
                    </Fade>
                </CardActions>
            </Card>
        </Badge>
    );
};

export default DrugCard;
