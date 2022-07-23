import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { RoundaboutLeft } from '@mui/icons-material';

interface IPlayingSongInfoProps {
    fileBeingPlayed?: File,
    fileMetadata?: mm.IAudioMetadata
    playingSound?: Howl,
    onPause: () => void;
    onPlay: () => void;
    isPaused: boolean;
    currentPlaybackTime: number | null;
    totalDuration: number | null;
};

export const PlayingSongInfo: React.FC<IPlayingSongInfoProps> = (props: IPlayingSongInfoProps) => {
    
    const getSongTitleText = () => {
        let songTitleText = 'Song';
        const fallbackFilename = props.fileBeingPlayed?.name;
        const title = props.fileMetadata?.common?.title;
        const artist = props.fileMetadata?.common?.artist;
        if (title) {
            songTitleText = `Currently playing: ${title}`;
            if (artist) {
                songTitleText += ` by ${artist}`;
            }
        } else if (fallbackFilename) {
            songTitleText = `Currently playing: ${fallbackFilename}`;
        }
        return songTitleText;
    }

    const getPlayPauseIcon = (): JSX.Element => {
        if (props.isPaused) {
            return (<IconButton color="inherit" onClick={props.onPlay}><PlayArrowIcon  /></IconButton>)
        }

        return (<IconButton color="inherit" onClick={props.onPause}><PauseIcon /></IconButton>);
    }

    const padSeconds = (seconds: number): string => {
        if (seconds < 10) {
            return `0${seconds}`;
        }
        return seconds.toString();
    }

    const parseNumberAsMinutesText = (time: number): string => {
        const flooredTime = Math.floor(time);
        const minutes = Math.floor(flooredTime / 60);
        const seconds = padSeconds(flooredTime % 60);
        return `${minutes}:${seconds}`;
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
            const songTitleText = getSongTitleText();
            
            return (
                <div className={classes.songInfoContainer}>
                    {getProgressBar()}
                    <div>{songTitleText}</div>
                    {getPlayPauseIcon()}
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};