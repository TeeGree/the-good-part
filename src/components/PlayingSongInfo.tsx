import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import { SongTitleContainer } from './SongTitleContainer';
import { VolumeContainer } from './VolumeContainer';
import { SkipNext, SkipPrevious } from '@mui/icons-material';

interface PlayingSongInfoProps {
    nameOfFile?: string,
    fileMetadata?: IAudioMetadata,
    playingSound?: Howl,
    onPause: () => void,
    onPlay: () => void,
    isPaused: boolean,
    currentPlaybackTime: number | null,
    totalDuration: number | null
    volume: number,
    changeVolume: (volume: number) => void,
    playNextSong: () => void,
    playPreviousSong: () => void,
    canPlayNextSong: boolean,
    canPlayPreviousSong: boolean
};

export const PlayingSongInfo: React.FC<PlayingSongInfoProps> = (props: PlayingSongInfoProps) => {
    const togglePlay = () => {
        if (props.isPaused) {
            props.onPlay();
        } else {
            props.onPause();
        }
    }

    const getPreviousButton = (): JSX.Element => {
        if (!props.canPlayPreviousSong) {
            return (<></>);
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
    }

    const getNextButton = (): JSX.Element => {
        if (!props.canPlayNextSong) {
            return (<></>);
        }

        return (
            <IconButton
                className={classes.nextButton}
                color="inherit"
                onClick={props.playNextSong}
            >
                <SkipNext />
            </IconButton>
        );
    }

    const getPlaybackButtons = (): JSX.Element => {
        return (
            <span className={classes.playbackButtonsContainer}>
                {getPreviousButton()}
                <IconButton
                    className={classes.playButton}
                    color="inherit"
                    onClick={togglePlay}
                >
                    {props.isPaused ? (<PlayArrowIcon />) : (<PauseIcon />)}
                </IconButton>
                {getNextButton()}
            </span>
        );
    }

    const getProgressBar = (): JSX.Element => {
        if (props.totalDuration === null) {
            return (<></>);
        }

        const currentPlaybackTime = props.currentPlaybackTime ?? 0;

        const percentPlayed = (currentPlaybackTime / props.totalDuration) * 100;
        const percentPlayedValue = percentPlayed === null ? 0 : percentPlayed;
        const width = `${percentPlayedValue}%`;
        const currentPlaybackTimeText = parseNumberAsMinutesText(currentPlaybackTime);
        const totalDurationText = parseNumberAsMinutesText(props.totalDuration);

        const timeText = `${currentPlaybackTimeText} / ${totalDurationText}`

        return (
            <>
                <div className={classes.progressBarContainer}>
                    <div className={classes.progressBarFill} style={{ width: width }}>
                    </div>
                </div>
                <div>
                    {timeText}
                </div>
            </>
        );
    }

    const getPlayingSongInfo = (): JSX.Element => {
        if (props.playingSound && props.playingSound) {
            return (
                <div className={classes.songInfoContainer}>
                    {getProgressBar()}
                    <div className={classes.songInfoParts}>
                        <SongTitleContainer
                            nameOfFile={props.nameOfFile}
                            fileMetadata={props.fileMetadata}
                        />
                        {getPlaybackButtons()}
                        <VolumeContainer
                            volume={props.volume}
                            changeVolume={props.changeVolume}
                        />
                    </div>
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};