import { Add, Remove } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import classes from './VolumeContainer.module.scss';

interface VolumeContainerProps {
    volume: number;
    changeVolume: (volume: number) => void;
}

// TODO: integrate theme throughout the app
const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    }
});

export const VolumeContainer: React.FC<VolumeContainerProps> = (props: VolumeContainerProps) => {
    const [hoveredOverSlider, setHoveredOverSlider] = useState(false);
    const [hoveredOverMinus, setHoveredOverMinus] = useState(false);
    const [hoveredOverPlus, setHoveredOverPlus] = useState(false);

    const onSliderChange = (_: Event, value: number | number[]): void => {
        props.changeVolume(value as number);
    };

    const getFormattedVolume = (): string => {
        const volumePct = Math.floor(props.volume * 100);
        return `${volumePct}%`;
    };

    const lowerVolumeByOne = (): void => {
        if (props.volume > 0) {
            props.changeVolume(props.volume - 0.01);
        }
    };

    const raiseVolumeByOne = (): void => {
        if (props.volume < 1) {
            props.changeVolume(props.volume + 0.01);
        }
    };

    return (
        <span className={classes.volumeContainer}>
            <ThemeProvider theme={theme}>
                <Tooltip
                    placement="top"
                    title={getFormattedVolume()}
                    open={hoveredOverMinus || hoveredOverSlider || hoveredOverPlus}
                >
                    <span className={classes.volumePartsContainer}>
                        <IconButton
                            onMouseEnter={() => setHoveredOverMinus(true)}
                            onMouseLeave={() => setHoveredOverMinus(false)}
                            className={classes.volumeIcon}
                            color="inherit"
                            onClick={lowerVolumeByOne}
                            disabled={props.volume === 0}
                        >
                            <Remove />
                        </IconButton>
                        <Slider
                            onMouseEnter={() => setHoveredOverSlider(true)}
                            onMouseLeave={() => setHoveredOverSlider(false)}
                            className={classes.volumeSliderContainer}
                            aria-label="Volume"
                            value={props.volume}
                            onChange={onSliderChange}
                            step={0.01}
                            min={0}
                            max={1}
                            color="primary"
                        />
                        <IconButton
                            onMouseEnter={() => setHoveredOverPlus(true)}
                            onMouseLeave={() => setHoveredOverPlus(false)}
                            className={classes.volumeIcon}
                            color="inherit"
                            onClick={raiseVolumeByOne}
                            disabled={props.volume === 1}
                        >
                            <Add />
                        </IconButton>
                    </span>
                </Tooltip>
            </ThemeProvider>
        </span>
    );
};
