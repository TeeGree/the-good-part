import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { parseNumberAsMinutesText } from '../utility/StringUtils';

interface PlayingSongInfoProps {
    nameOfFile?: string,
    fileMetadata?: IAudioMetadata
    playingSound?: Howl,
    onPause: () => void,
    onPlay: () => void,
    isPaused: boolean,
    currentPlaybackTime: number | null,
    totalDuration: number | null
};

export const PlayingSongInfo: React.FC<PlayingSongInfoProps> = (props: PlayingSongInfoProps) => {
    
    const getSongTitleText = () => {
        const createSongText = (songTitle: string) => {
            return `Currently playing: ${songTitle}`;
        }

        let songTitleText = 'Song';
        const fallbackFilename = props.nameOfFile;
        const title = props.fileMetadata?.common?.title;
        const artist = props.fileMetadata?.common?.artist;
        if (title) {
            songTitleText = title;
            if (artist) {
                songTitleText += ` by ${artist}`;
            }
        } else if (fallbackFilename) {
            songTitleText = fallbackFilename;
        }
        return createSongText(songTitleText);
    }

    const togglePlay = () => {
        if (props.isPaused) {
            props.onPlay();
        } else {
            props.onPause();
        }
    }

    const getPlayPauseIcon = (): JSX.Element => {
        return (
            <IconButton
                color="inherit"
                onClick={togglePlay}
            >
                {props.isPaused ? (<PlayArrowIcon />) : (<PauseIcon />)}
            </IconButton>
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