import React from 'react';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface FooterActionButtonsProps {
    isFavorite: boolean;
    onSimilar: React.MouseEventHandler<HTMLButtonElement>;
    onFavorite: React.MouseEventHandler<HTMLButtonElement>;
}

const FooterActionButtons: React.FC<FooterActionButtonsProps> = (props: FooterActionButtonsProps) => {
    const { isFavorite, onSimilar, onFavorite } = props;

    return (
        <>
            <Tooltip title="Similar">
                <IconButton onClick={onSimilar}>
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
                    onClick={onFavorite}
                />
            </Tooltip>
        </>
    );
};

export default FooterActionButtons;
