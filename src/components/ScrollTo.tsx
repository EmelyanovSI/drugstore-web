import React from 'react';
import { Box, Fade, useScrollTrigger } from '@mui/material';

interface Props {
    children: React.ReactElement;
    elementId: string;
}

const ScrollTo: React.FC<Props> = (props: Props) => {
    const { children, elementId } = props;
    const trigger = useScrollTrigger({
        threshold: 50
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (
            (event.target as HTMLDivElement).ownerDocument || document
        ).querySelector('#' + elementId);

        if (anchor) {
            anchor.scrollIntoView({ block: 'center' });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Fade>
    );
};

export default ScrollTo;
