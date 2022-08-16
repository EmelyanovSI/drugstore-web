import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface ActionButtonsProps {
    editMode: boolean;
    onSave: React.MouseEventHandler<HTMLButtonElement>;
    onCancel: React.MouseEventHandler<HTMLButtonElement>;
    onEdit: React.MouseEventHandler<HTMLButtonElement>;
}

const ActionButtons: React.FC<ActionButtonsProps> = (props: ActionButtonsProps) => {
    const { editMode, onSave, onCancel, onEdit } = props;
    if (editMode) {
        return (
            <>
                <Tooltip title="Save">
                    <IconButton onClick={onSave}>
                        <CheckIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                    <IconButton onClick={onCancel}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    return (
        <>
            <Tooltip title="Edit">
                <IconButton onClick={onEdit}>
                    <ModeEditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default ActionButtons;
