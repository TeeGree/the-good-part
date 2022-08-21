import { IAudioMetadata } from 'music-metadata';
import React from 'react';
import { getFilenameWithoutExtension } from '../utility/FilePathUtils';
import classes from './SongTitleContainer.module.scss';
import { TooltipOnOverflow } from './TooltipOnOverflow';

interface SongTitleContainerProps {
  nameOfFile?: string
  fileMetadata?: IAudioMetadata
}

export const SongTitleContainer: React.FC<SongTitleContainerProps> = (props: SongTitleContainerProps) => {

    const getSongTitleContainer = (): JSX.Element => {
        return (
            <div className={classes.songTitleContainer}>
                {getSongTitle()}
                {getArtist()}
            </div>
        );
    }

    const getSongTitle = (): JSX.Element => {
        return (
            <TooltipOnOverflow text={getSongTitleText()} />
        );
    }

    const getArtist = (): JSX.Element => {
        return (
            <div className={classes.artistName}>
                {getArtistText()}
            </div>
        );
    }

    const getArtistText = (): string => {
        return props.fileMetadata?.common?.artist ?? '';
    }

    const getSongTitleText = (): string => {
        const fallbackFilename = props.nameOfFile;
        const title = props.fileMetadata?.common?.title;

        if (title !== undefined) {
            return title;
        } else if (fallbackFilename !== undefined) {
            return getFilenameWithoutExtension(fallbackFilename);
        }

        return 'Unknown';
    }

    return getSongTitleContainer();
}
