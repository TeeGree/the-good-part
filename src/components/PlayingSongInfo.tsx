import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';
import classes from './PlayingSongInfo.module.scss';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';

interface IPlayingSongInfoProps {
    fileBeingPlayed?: File,
    fileMetadata?: mm.IAudioMetadata
    playingSound?: Howl,
    playingSoundPercentPlayed: number | null;
    onPause: () => void;
    onPlay: () => void;
    isPaused: boolean;
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

    const getPlayingSongInfo = (): JSX.Element => {
        if (props.playingSound && props.playingSound) {
            const songTitleText = getSongTitleText();
            const percentPlayed = props.playingSoundPercentPlayed === null ? 0 : props.playingSoundPercentPlayed;
            const width = `${percentPlayed}%`;
            
            return (
                <div className={classes.songInfoContainer}>
                    <div className={classes.progressBarContainer}>
                        <div className={classes.progressBarFill} style={{ width: width }}>
                        </div>
                    </div>
                    <div>{songTitleText}</div>
                    {getPlayPauseIcon()}
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};