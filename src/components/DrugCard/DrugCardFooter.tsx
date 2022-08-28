import React, { useEffect, useState } from 'react';
import { CardActions, Chip, Fade, IconButton, InputAdornment, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateTime } from 'luxon';

interface CommonProps {
    cost?: number | string;
}

interface StaticProps {
    cost?: number | string;
    onClick: () => void;
}

interface DynamicProps extends CommonProps {
    error?: string;
    onChange: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface Props extends DynamicProps {
    children?: JSX.Element & React.ReactNode;
    isEdit: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
    event.stopPropagation();
};

const StaticCardFooter: React.FC<StaticProps> = (props: StaticProps) => {
    const { cost, onClick } = props;

    const handleChipClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        handleStopPropagation(event);
        onClick();
    };

    return cost ? (
        <Chip
            label={`$${cost}`}
            size="small"
            variant="outlined"
            color="success"
            onClick={handleChipClick}
        />
    ) : (
        <Chip
            label={'Cost not specified'}
            size="small"
            variant="outlined"
            color="warning"
            onClick={handleStopPropagation}
        />
    );
};

const DynamicCardFooter: React.FC<DynamicProps> = (props: DynamicProps) => {
    const { cost, error, onChange } = props;

    const handleCostChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange('cost', event.target.value);
    };

    return (
        <TextField
            label="Cost"
            placeholder="Cost"
            type="number"
            size="small"
            error={!!error}
            helperText={error}
            value={cost}
            onChange={handleCostChange}
            onClick={handleStopPropagation}
            InputProps={{
                inputProps: { min: 1, max: 999999999 },
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton size="small" edge="end" onClick={() => onChange('cost', '')}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};

const DrugCardFooter: React.FC<Props> = (props: Props) => {
    const {
        isEdit,
        children,
        createdAt,
        updatedAt,
        cost,
        ...other
    } = props;

    const createdTime = createdAt ? DateTime.fromISO(createdAt) : null;
    const updatedTime = updatedAt ? DateTime.fromISO(updatedAt) : createdTime;
    const updatedTimeString = updatedTime?.toFormat('dd LLL yyyy');
    const diff = updatedTime && DateTime.now().diff(updatedTime, 'months');
    const isOutdated = diff ? diff.months > 6 : false;
    const [showDate, setShowDate] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            showDate && setShowDate(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [showDate]);

    const handleClick = () => {
        setShowDate(true);
    };

    const outdatedChip = isOutdated ? (
        <Chip
            label="Outdated"
            size="small"
            variant="outlined"
            color="error"
            onClick={handleStopPropagation}
        />
    ) : (
        <Fade in={showDate}>
            <Chip
                label={updatedTimeString}
                size="small"
                variant="outlined"
                color="success"
                onClick={handleStopPropagation}
            />
        </Fade>
    );

    return (
        <CardActions>
            {isEdit ? (
                <DynamicCardFooter
                    {...other}
                    cost={cost}
                />
            ) : (
                <StaticCardFooter
                    cost={cost}
                    onClick={handleClick}
                />
            )}
            {!isEdit && cost && outdatedChip}
            {children}
        </CardActions>
    );
};

export default DrugCardFooter;
