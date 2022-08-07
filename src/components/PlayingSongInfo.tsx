import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// TODO: integrate theme throughout the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
  },
});

export type allowedVolume = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;

interface PlayingSongInfoProps {
    nameOfFile?: string,
    fileMetadata?: IAudioMetadata
    playingSound?: Howl,
    onPause: () => void,
    onPlay: () => void,
    isPaused: boolean,
    currentPlaybackTime: number | null,
    totalDuration: number | null
    volume: allowedVolume,
    changeVolume: (volume: allowedVolume) => void
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

    const onSliderChange = (_: Event, value: number | number[]) => {
        props.changeVolume(value as allowedVolume);
    }

    const getVolumeSlider = (): JSX.Element => {
        return (
            <span className={classes.volumeSliderContainer}>
                <ThemeProvider theme={theme}>
                    <Slider
                        aria-label="Volume"
                        value={props.volume}
                        onChange={onSliderChange}
                        step={0.1}
                        min={0}
                        max={1}
                        color="primary"
                    />
                </ThemeProvider>
            </span>
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
                        {getVolumeSlider()}
                    </div>
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};