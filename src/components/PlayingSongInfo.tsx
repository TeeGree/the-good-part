import { Howl } from 'howler';
import { IAudioMetadata } from 'music-metadata';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import Slider from '@mui/material/Slider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SongTitleContainer } from './SongTitleContainer';

// TODO: integrate theme throughout the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
  },
});

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
    changeVolume: (volume: number) => void
};

export const PlayingSongInfo: React.FC<PlayingSongInfoProps> = (props: PlayingSongInfoProps) => {
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
        props.changeVolume(value as number);
    }

    const getVolumeSlider = (): JSX.Element => {
        return (
            <span className={classes.volumeSliderContainer}>
                <ThemeProvider theme={theme}>
                    <Slider
                        aria-label="Volume"
                        value={props.volume}
                        onChange={onSliderChange}
                        step={0.01}
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
                        <SongTitleContainer
                            nameOfFile={props.nameOfFile}
                            fileMetadata={props.fileMetadata}
                        />
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