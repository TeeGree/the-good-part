import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';
import classes from './PlayingSongInfo.module.scss';

interface IPlayingSongInfoProps {
    fileBeingPlayed?: File,
    fileMetadata?: mm.IAudioMetadata
    playingSound?: Howl,
    playingSoundPercentPlayed: number | null;
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

    const getPlayingSongInfo = (): JSX.Element => {
        if (props.playingSound && props.playingSound && props.playingSound.playing()) {
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
                </div>
            );
        }
        return (<></>);
    }

    return getPlayingSongInfo();
};