import Tooltip from "@mui/material/Tooltip";
import { IAudioMetadata } from "music-metadata";
import React, { useEffect, useRef, useState } from "react";
import classes from './SongTitleContainer.module.scss';

interface SongTitleContainerProps {
    nameOfFile?: string,
    fileMetadata?: IAudioMetadata,
}

export const SongTitleContainer: React.FC<SongTitleContainerProps> = (props: SongTitleContainerProps) => {

    const songTitleElementRef = useRef<HTMLInputElement | null>(null);
    const [showTooltip, setShouldShowTooltip] = useState(false)

    const getShouldShowTooltip = () => {
        const offsetWidth = songTitleElementRef?.current?.offsetWidth ?? 0;
        const scrollWidth = songTitleElementRef?.current?.scrollWidth ?? 0;
        return offsetWidth < scrollWidth;
    };

    useEffect(() => {
        const handleResize = () => {
            setShouldShowTooltip(getShouldShowTooltip())
        }
    
        if (songTitleElementRef.current) {
            setShouldShowTooltip(getShouldShowTooltip())
        }
    
        window.addEventListener("resize", handleResize)
    
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [songTitleElementRef])

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
            <div ref={songTitleElementRef} className={classes.songTitle}>
                {getSongTitleText()}
            </div>
        );
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

    const getSongHoverText = () => {
        let songInfoText = getSongTitleText();
        const artist = getArtistText();

        if (artist) {
            songInfoText += ` by ${artist}`;
        }

        return songInfoText;
    }

    const getElements = (): JSX.Element => {
        if (showTooltip) {
            return (
                <Tooltip placement="top" title={getSongHoverText()}>
                    {getSongTitleContainer()}
                </Tooltip>
            );
        }

        return getSongTitleContainer();
    }

    return getElements();
}