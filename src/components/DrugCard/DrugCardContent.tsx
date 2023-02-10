import React from 'react';
import { Autocomplete, CardContent, Chip, TextField, Typography } from '@mui/material';

import { Substance } from '@/interfaces/substacne.interface';
import { correctName } from '@/utils';

interface StaticProps {
    composition: Array<Substance>;
}

interface DynamicProps extends StaticProps {
    compositionValues: Array<string>;
    error?: string | Array<string>;
    onChange: (field: string, value: any, shouldValidate?: boolean) => void;
}

interface Props extends DynamicProps {
    isEdit: boolean;
}

const StaticCardContent: React.FC<StaticProps> = (props: StaticProps) => {
    const { composition } = props;

    return (
        <CardContent>
            {composition.map(({ name, activeSubstance }, index) => (
                <Typography key={index} variant="body2">
                    {activeSubstance ? <strong>{correctName(name)}</strong> : correctName(name)}
                </Typography>
            ))}
        </CardContent>
    );
};

const DynamicCardContent: React.FC<DynamicProps> = (props: DynamicProps) => {
    const { composition, compositionValues, error, onChange } = props;
    const substances = composition.map(({ name }) => name);

    const handleCompositionChange = (event: React.SyntheticEvent, value: string | string[]) => {
        onChange('composition', value);
    };

    const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return (
        <CardContent>
            <Autocomplete
                multiple
                freeSolo
                size="small"
                options={substances}
                defaultValue={[...substances]}
                value={compositionValues}
                onChange={handleCompositionChange}
                renderTags={(value: readonly string[], getTagProps) => (
                    value.map((option, index) => (
                        <Chip
                            size="small"
                            label={option}
                            variant={composition.find(({ name }) => name === option) ? 'filled' : 'outlined'}
                            {...getTagProps({ index })}
                        />
                    ))
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Substance(s)"
                        placeholder="Substance"
                        error={!!error}
                        helperText={Array.isArray(error) ? error.join(' ') : error}
                        onClick={handleStopPropagation}
                        required
                    />
                )}
            />
        </CardContent>
    );
};

const DrugCardContent: React.FC<Props> = (props: Props) => {
    const { isEdit, composition, ...other } = props;

    if (isEdit) {
        return (
            <DynamicCardContent {...other} composition={composition} />
        );
    }

    return (
        <StaticCardContent composition={composition} />
    );
};

export default DrugCardContent;
