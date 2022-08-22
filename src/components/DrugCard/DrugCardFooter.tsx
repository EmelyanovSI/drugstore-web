import React from 'react';
import { CardActions, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import { DateTime } from 'luxon';
import CloseIcon from '@mui/icons-material/Close';

interface StaticProps {
    cost?: number | string;
}

interface DynamicProps extends StaticProps {
    error?: string;
    onChange: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface Props extends DynamicProps {
    children?: JSX.Element & React.ReactNode;
    isEdit: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
    event.stopPropagation();
};

const StaticCardFooter: React.FC<StaticProps> = (props: StaticProps) => {
    const { cost } = props;

    return cost ? (
        <Chip
            label={`$${cost}`}
            size="small"
            variant="outlined"
            color="success"
            onClick={handleStopPropagation}
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

    const createdTime = createdAt ? DateTime.fromJSDate(createdAt) : null;
    const updatedTime = updatedAt ? DateTime.fromJSDate(updatedAt) : createdTime;
    const updatedTimeString = updatedTime?.toFormat('yyyy LLL dd');

    return (
        <CardActions>
            {isEdit ? <DynamicCardFooter {...other} cost={cost} /> : <StaticCardFooter cost={cost} />}
            {!isEdit && updatedTimeString && (
                <Chip
                    label={updatedTimeString}
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={handleStopPropagation}
                />
            )}
            {children}
        </CardActions>
    );
};

export default DrugCardFooter;
