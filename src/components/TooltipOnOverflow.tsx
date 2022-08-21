import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import classes from './TooltipOnOverflow.module.scss';

interface TooltipOnOverflowProps {
    text?: string
}

export const TooltipOnOverflow: React.FC<TooltipOnOverflowProps> = (props: TooltipOnOverflowProps) => {
    const elementRef = useRef<HTMLInputElement | null>(null);
    const [showTooltip, setShouldShowTooltip] = useState(false);

    const getShouldShowTooltip = (): boolean => {
        const offsetWidth = elementRef?.current?.offsetWidth ?? 0;
        const scrollWidth = elementRef?.current?.scrollWidth ?? 0;
        return offsetWidth < scrollWidth;
    }

    useEffect(() => {
        const handleResize = (): void => {
            setShouldShowTooltip(getShouldShowTooltip());
        }

        if (elementRef.current != null) {
            setShouldShowTooltip(getShouldShowTooltip());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [elementRef, props.text]);

    const getTextElement = (): JSX.Element => {
        return (
            <div ref={elementRef} className={classes.container}>
                {props.text}
            </div>
        );
    }

    const getElements = (): JSX.Element => {
        if (showTooltip && props.text !== undefined) {
            return (
                <Tooltip placement="top" title={props.text}>
                    {getTextElement()}
                </Tooltip>
            )
        }

        return getTextElement();
    }

    return getElements();
}
