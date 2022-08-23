import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    InputAdornment,
    Slide,
    TextField
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

import ActionButtons from './DrugCard/ActionButtons';
import { getValidationSchema } from '../utils';
import { useAppSelector } from '../redux/store';
import { Country } from '../interfaces/countries.interface';
import { CountryChip } from './ChipNav/CountryChip';

interface Props {
    open: boolean;
    handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateDrugDialog: React.FC<Props> = (props: Props) => {
    const { open, handleClose } = props;
    const countries = useAppSelector<Array<Country>>((state) => state.countriesReducer.countries);
    const substances: Array<string> = [];

    const {
        values,
        errors,
        isValid,
        setFieldValue,
        handleSubmit
    } = useFormik({
        initialValues: {
            drug: '',
            country: '',
            composition: [],
            cost: ''
        },
        validationSchema: getValidationSchema(),
        enableReinitialize: true,
        validateOnMount: true,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        }
    });

    const [inputValue, setInputValue] = useState(values.country);

    const handleActionSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        handleSubmit();
        handleClose(event, 'escapeKeyDown');
    };

    const handleActionCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        handleClose(event, 'escapeKeyDown');
    };

    const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return (
        <Dialog
            keepMounted
            open={open}
            onClose={handleActionCancel}
            TransitionComponent={Transition}
        >
            <DialogContent>
                <Card sx={{ width: 345 }}>
                    <CardHeader
                        title="Create new drug"
                        action={
                            <ActionButtons
                                isEdit
                                isValid={isValid}
                                onSave={handleActionSave}
                                onCancel={handleActionCancel}
                            />
                        }
                    />
                    <CardContent>
                        <TextField
                            size="small"
                            margin="dense"
                            label="Drug name"
                            placeholder="Drug name"
                            value={values.drug}
                            error={!!errors.drug}
                            helperText={errors.drug}
                            onChange={event => setFieldValue('drug', event.target.value)}
                            onClick={handleStopPropagation}
                            required
                        />
                        <Autocomplete
                            autoHighlight
                            size="small"
                            options={countries.map(value => value.name)}
                            value={values.country ? values.country : null}
                            inputValue={inputValue}
                            onChange={(_, value) => setFieldValue('country', value)}
                            onInputChange={(_, value) => setInputValue(value)}
                            getOptionLabel={(option) => option}
                            isOptionEqualToValue={(option, value) => option === value}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <CountryChip
                                        label={option}
                                        checked={option === values.country}
                                        onClick={() => {}}
                                    />
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="dense"
                                    label="Country"
                                    placeholder="Country"
                                    error={!!errors.country}
                                    helperText={errors.country}
                                    onClick={handleStopPropagation}
                                    required
                                />
                            )}
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            size="small"
                            options={substances}
                            defaultValue={[...substances]}
                            value={values.composition}
                            onChange={(_, value) => setFieldValue('composition', value)}
                            renderTags={(value: readonly string[], getTagProps) => (
                                value.map((option, index) => (
                                    <Chip
                                        size="small"
                                        label={option}
                                        variant={values.composition.find(({ name }) => name === option) ? 'filled' : 'outlined'}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="dense"
                                    label="Substance(s)"
                                    placeholder="Substance"
                                    error={!!errors.composition}
                                    helperText={
                                        Array.isArray(errors.composition)
                                            ? errors.composition.join(' ')
                                            : errors.composition
                                    }
                                    onClick={handleStopPropagation}
                                    required
                                />
                            )}
                        />
                        <TextField
                            label="Cost"
                            placeholder="Cost"
                            type="number"
                            size="small"
                            margin="dense"
                            error={!!errors.cost}
                            helperText={errors.cost}
                            value={values.cost}
                            onChange={event => setFieldValue('cost', event.target.value)}
                            onClick={handleStopPropagation}
                            InputProps={{
                                inputProps: { min: 1, max: 999999999 },
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" edge="end" onClick={() => setFieldValue('cost', '')}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDrugDialog;
