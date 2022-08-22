import React from 'react';
import { Autocomplete, CardContent, Chip, TextField, Typography } from '@mui/material';

import { correctName } from '../../utils';
import { Substance } from '../../interfaces/substacne.interface';

interface StaticProps {
    composition: Array<Substance>;
}

interface DynamicProps extends StaticProps {

}

interface Props extends DynamicProps {
    isEdit: boolean;
}

const StaticCardContent: React.FC<StaticProps> = (props: StaticProps) => {
    const { composition } = props;

    return (
        <CardContent>
            {composition.map(({ _id, name, activeSubstance }) => (
                <Typography key={_id} variant="body2">
                    {activeSubstance ? <strong>{correctName(name)}</strong> : correctName(name)}
                </Typography>
            ))}
        </CardContent>
    );
};

const DynamicCardContent: React.FC<DynamicProps> = (props: DynamicProps) => {
    const { composition } = props;
    const substances = composition.map(({ name }) => name);

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
                        onClick={handleStopPropagation}
                    />
                )}
            />
        </CardContent>
    );
};

const DrugCardContent: React.FC<Props> = (props: Props) => {
    const { isEdit, composition } = props;

    if (isEdit) {
        return (
            <DynamicCardContent composition={composition} />
        );
    }

    return (
        <StaticCardContent composition={composition} />
    );
};

export default DrugCardContent;
