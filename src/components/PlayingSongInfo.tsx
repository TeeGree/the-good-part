import React, { SyntheticEvent, useState } from 'react';
import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import { SxProps, Theme } from '@mui/material/styles';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import { SongTitleContainer } from './SongTitleContainer';
import { VolumeContainer } from './VolumeContainer';
import classes from './PlayingSongInfo.module.scss';
import { useIsPausedSelector } from '../redux/hooks';

interface PlayingSongInfoProps {
    nameOfFile?: string;
    fileMetadata?: IAudioMetadata;
    playingSound?: Howl;
    onPause: (shouldSetPauseState: boolean) => void;
    onPlay: () => void;
    currentPlaybackTime: number | null;
    totalDuration: number | null;
    playNextSong: () => void;
    playPreviousSong: () => void;
    canPlayNextSong: boolean;
    canPlayPreviousSong: boolean;
    setPlaybackTime: (value: number) => void;
    seekToPosition: (pos: number) => void;
}

export const PlayingSongInfo: React.FC<PlayingSongInfoProps> = (props: PlayingSongInfoProps) => {
    const [hoveredOverPlaybackSlider, setHoveredOverPlaybackSlider] = useState(false);
    const isPaused = useIsPausedSelector();

    const togglePlay = (): void => {
        if (isPaused) {
            props.onPlay();
        } else {
            props.onPause(true);
        }
    };

    const getPreviousButton = (): JSX.Element => {
        if (!props.canPlayPreviousSong) {
            return <></>;
        }

        return (
            <IconButton
                className={classes.previousButton}
                color="inherit"
                onClick={props.playPreviousSong}
            >
                <SkipPrevious />
            </IconButton>
        );
    };

    const getNextButton = (): JSX.Element => {
        if (!props.canPlayNextSong) {
            return <></>;
        }

        return (
            <IconButton className={classes.nextButton} color="inherit" onClick={props.playNextSong}>
                <SkipNext />
            </IconButton>
        );
    };

    const getPlaybackButtons = (): JSX.Element => (
        <span className={classes.playbackButtonsContainer}>
            {getPreviousButton()}
            <IconButton className={classes.playButton} color="inherit" onClick={togglePlay}>
                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
            {getNextButton()}
        </span>
    );

    const getSliderStyles = (): SxProps<Theme> => {
        const styles: SxProps<Theme> = {
            color: 'purple',
            padding: 0,
            height: '5px',
            borderRadius: 0,
            display: 'inherit',
            overflowX: 'clip',
            '& .MuiSlider-rail': {
                backgroundColor: 'lightblue',
                opacity: 1,
            },
        };

        if (!hoveredOverPlaybackSlider) {
            styles['& .MuiSlider-thumb'] = {
                display: 'none',
            };
        }

        return styles;
    };

    const onSliderChange = (_: Event, value: number | number[]): void => {
        if (!isPaused) {
            props.onPause(false);
        }

        props.setPlaybackTime(value as number);
    };

    const onSliderChangeCommitted = (
        _: Event | SyntheticEvent<Element, Event>,
        value: number | number[],
    ): void => {
        props.seekToPosition(value as number);

        if (!isPaused) {
            props.onPlay();
        }
    };

    const getProgressBar = (): JSX.Element => {
        if (props.totalDuration === null) {
            return <></>;
        }

        const currentPlaybackTime = props.currentPlaybackTime ?? 0;

        const currentPlaybackTimeText = parseNumberAsMinutesText(currentPlaybackTime);
        const totalDurationText = parseNumberAsMinutesText(props.totalDuration);

        const timeText = `${currentPlaybackTimeText} / ${totalDurationText}`;

        return (
            <>
                <Slider
                    onMouseEnter={() => setHoveredOverPlaybackSlider(true)}
                    onMouseLeave={() => setHoveredOverPlaybackSlider(false)}
                    className="progressBarContainer"
                    aria-label="playback"
                    value={currentPlaybackTime}
                    onChange={onSliderChange}
                    onChangeCommitted={onSliderChangeCommitted}
                    step={0.01}
                    min={0}
                    max={props.totalDuration}
                    sx={getSliderStyles()}
                />
                <div>{timeText}</div>
            </>
        );
    };

    const getPlayingSongInfo = (): JSX.Element => {
        if (props.playingSound != null && props.playingSound !== undefined) {
            return (
                <div className={classes.songInfoContainer}>
                    {getProgressBar()}
                    <div className={classes.songInfoParts}>
                        <SongTitleContainer
                            nameOfFile={props.nameOfFile}
                            fileMetadata={props.fileMetadata}
                        />
                        {getPlaybackButtons()}
                        <VolumeContainer />
                    </div>
                </div>
            );
        }
        return <></>;
    };

    return getPlayingSongInfo();
};
