import React, { useEffect, useState } from 'react';
import {
    Badge,
    Box,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Fade,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { Drug } from '../../interfaces/drugs.interface';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
    addDrugToFavorite,
    markDrugAsDeselected,
    markDrugAsSelected,
    removeDrugFromFavorite,
    selectIsDrugFavorite,
    selectIsDrugSelected,
    selectSelectedDrugsIsEmpty,
    setGroupBy
} from '../../redux/appSlice';
import { fetchDrugsByActiveSubstance } from '../../redux/drugsSlice';
import { GroupBy } from '../../constants/enums';
import ActionButtons from './ActionButtons';
import DrugCardHeader from './DrugCardHeader';
import { correctName } from '../../utils';
import { useCardFormik } from '../../hooks/useCardFormik';

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
    const readonly = useAppSelector<boolean>((state) => state.appReducer.readonly);
    const isSelected = useAppSelector(selectIsDrugSelected(drugId));
    const isFavorite = useAppSelector(selectIsDrugFavorite(drugId));
    const selectedDrugsIsEmpty = useAppSelector(selectSelectedDrugsIsEmpty);

    const [isActionButtonsVisible, setIsActionButtonsVisible] = useState(false);
    const [isCheckButtonVisible, setIsCheckButtonVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { formik, status, message } = useCardFormik(drugName, countryId);
    const {
        values,
        errors,
        isValid,
        setFieldValue,
        handleSubmit,
        handleReset
    } = formik;

    useEffect(() => {
        readonly && setIsEdit(false);
    }, [readonly]);

    const handleBadgeClick = () => {
        if (!isCheckButtonVisible && selectedDrugsIsEmpty) {
            return;
        }
        isSelected
            ? dispatch(markDrugAsDeselected(drugId))
            : dispatch(markDrugAsSelected(drugId));
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
        setIsEdit(!isEdit);
    };

    const handleActionSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsEdit(!isEdit);
        handleSubmit();
    };

    const handleActionCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsEdit(!isEdit);
        handleReset(event);
    };

    const badgeContent = (
        <Box
            onMouseOver={() => setIsCheckButtonVisible(true)}
            onMouseOut={() => setIsCheckButtonVisible(false)}
        >
            {isCheckButtonVisible ? (
                <Tooltip title={isSelected ? 'Deselect' : 'Select'}>
                    <Box>{isSelected
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
            invisible={!isActionButtonsVisible && !isSelected}
            color="success"
            onMouseOver={() => setIsActionButtonsVisible(true)}
            onMouseOut={() => setIsActionButtonsVisible(false)}
            onClick={handleBadgeClick}
            showZero
        >
            <Card
                sx={{ width: 345 }}
                variant={isSelected ? 'elevation' : 'outlined'}
                elevation={isSelected ? 4 : 0}
            >
                <DrugCardHeader
                    {...{ status, message, isEdit }}
                    drug={values.drug}
                    country={values.country}
                    drugError={errors.drug}
                    countryError={errors.country}
                    onChange={setFieldValue}
                >
                    <Fade in={!readonly && (isEdit || isActionButtonsVisible)}>
                        <Box>
                            <ActionButtons
                                {...{ isEdit, isValid }}
                                onEdit={handleActionEdit}
                                onSave={handleActionSave}
                                onCancel={handleActionCancel}
                            />
                        </Box>
                    </Fade>
                </DrugCardHeader>
                <CardContent>{
                    composition.map(({ _id, name, activeSubstance }) => (
                        <Typography key={_id} variant="body2">
                            {activeSubstance ? <strong>{correctName(name)}</strong> : correctName(name)}
                        </Typography>
                    ))
                }</CardContent>
                <CardActions>
                    ~ ${cost || '10'}
                    <Fade in={isActionButtonsVisible}>
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
