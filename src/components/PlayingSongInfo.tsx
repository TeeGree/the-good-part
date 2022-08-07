import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import Tooltip from '@mui/material/Tooltip';

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

    const getSongTitleSection = (): JSX.Element => {
        return (
            <Tooltip placement="top" title={getSongHoverText()}>
                <div className={classes.songTitleContainer}>
                    {getSongTitle()}
                    {getArtist()}
                </div>
            </Tooltip>
        );
    }

    const getSongTitle = (): JSX.Element => {
        return (
            <div className={classes.songTitle}>
                {getSongTitleText()}
            </div>
        );
    }

    const getSongTitleText = () => {
        const fallbackFilename = props.nameOfFile;
        const title = props.fileMetadata?.common?.title;

        if (title) {
            return title;
        } else if (fallbackFilename) {
            return fallbackFilename;
        }

        return 'Unknown';
    }

    const getArtist = () => {
        return (
            <div className={classes.artistName}>
                {getArtistText()}
            </div>
        )
    }

    const getArtistText = () => {
        return props.fileMetadata?.common?.artist ?? '';
    }

    const getSongHoverText = () => {
        let songInfoText = getSongTitleText();
        const artist = getArtistText();

        if (artist) {
            songInfoText += ` by ${artist}`;
        }

        return songInfoText;
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
            <span className={classes.playIconContainer}>
                <IconButton
                    color="inherit"
                    onClick={togglePlay}
                >
                    {props.isPaused ? (<PlayArrowIcon />) : (<PauseIcon />)}
                </IconButton>
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
                        {getSongTitleSection()}
                        {getPlayPauseIcon()}
                    </div>
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};