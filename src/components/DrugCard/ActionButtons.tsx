import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface ActionButtonsProps {
    isEdit: boolean;
    isValid: boolean;
    onSave: React.MouseEventHandler<HTMLButtonElement>;
    onCancel: React.MouseEventHandler<HTMLButtonElement>;
    onEdit: React.MouseEventHandler<HTMLButtonElement>;
}

const ActionButtons: React.FC<ActionButtonsProps> = (props: ActionButtonsProps) => {
    const {
        isEdit,
        isValid,
        onSave,
        onCancel,
        onEdit
    } = props;

    if (isEdit) {
        return (
            <>
                {isValid ? (
                    <Tooltip title="Save">
                        <IconButton onClick={onSave}>
                            <CheckIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Invalid">
                        <span>
                            <IconButton disabled onClick={onSave}>
                                <CheckIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
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
