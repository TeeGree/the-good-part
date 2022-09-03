import { Add, Remove } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import classes from './VolumeContainer.module.scss';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { SET_VOLUME } from '../redux/actions/VolumeActions';

const minAdjustment = 0.01;

export const VolumeContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    const [hoveredOverSlider, setHoveredOverSlider] = useState(false);
    const [hoveredOverMinus, setHoveredOverMinus] = useState(false);
    const [hoveredOverPlus, setHoveredOverPlus] = useState(false);

    const volume = useAppSelector((state) => state.volume?.volume ?? 0);

    const changeVolume = (value: number): void => {
        Howler.volume(value);
        dispatch({ type: SET_VOLUME, volume: value });
    };

    const onSliderChange = (_: Event, value: number | number[]): void => {
        changeVolume(value as number);
    };

    const getFormattedVolume = (): string => {
        const volumePct = Math.floor(volume * 100);
        return `${volumePct}%`;
    };

    const lowerVolumeByOne = (): void => {
        if (volume > 0) {
            changeVolume(volume - minAdjustment);
        }
    };

    const raiseVolumeByOne = (): void => {
        if (volume < 1) {
            changeVolume(volume + minAdjustment);
        }
    };

    return (
        <span className={classes.volumeContainer}>
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
                        disabled={volume === 0}
                    >
                        <Remove />
                    </IconButton>
                    <Slider
                        onMouseEnter={() => setHoveredOverSlider(true)}
                        onMouseLeave={() => setHoveredOverSlider(false)}
                        className={classes.volumeSliderContainer}
                        aria-label="Volume"
                        value={volume}
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
                        disabled={volume === 1}
                    >
                        <Add />
                    </IconButton>
                </span>
            </Tooltip>
        </span>
    );
};
