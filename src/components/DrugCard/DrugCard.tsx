import React, { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Box,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Fade,
    IconButton,
    Tooltip
} from '@mui/material';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { Drug } from '../../interfaces/drugs.interface';
import { Country } from '../../interfaces/countries.interface';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getCountryById } from '../../services/countries.service';
import {
    addDrugToFavorite,
    removeDrugFromFavorite,
    markDrugAsSelected,
    selectIsDrugFavorite,
    selectIsDrugSelected,
    selectSelectedDrugsIsEmpty,
    markDrugAsDeselected,
    setGroupBy
} from '../../redux/appSlice';
import { fetchDrugsByActiveSubstance } from '../../redux/drugsSlice';
import { GroupBy } from '../../constants/enum';
import ActionButtons from './ActionButtons';
import DrugCardHeader from './DrugCardHeader';

interface Props {
    drug: Drug;
    number: number;
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
    const readonly = useAppSelector(state => state.appReducer.readonly);
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

    useEffect(() => {
        readonly && setEditMode(false);
    }, [readonly]);

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

    const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        isFavorite
            ? dispatch(removeDrugFromFavorite(drugId))
            : dispatch(addDrugToFavorite(drugId));
    };

    const handleSimilarClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        const substance = composition.find(substance => substance.activeSubstance);
        dispatch(setGroupBy(GroupBy.Similar));
        dispatch(fetchDrugsByActiveSubstance(substance?._id));
    };

    const handleActionEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setEditMode(!editMode);
    };

    const handleActionSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setEditMode(!editMode);
    };

    const handleActionCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setEditMode(!editMode);
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
                <DrugCardHeader isEditMode={editMode} drugName={drugName} composition={composition}>
                    <Fade in={!readonly && (editMode || btnVisible)}>
                        <Box>
                            <ActionButtons
                                editMode={editMode}
                                onEdit={handleActionEdit}
                                onSave={handleActionSave}
                                onCancel={handleActionCancel}
                            />
                        </Box>
                    </Fade>
                </DrugCardHeader>
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
                                <IconButton onClick={handleSimilarClick}>
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
