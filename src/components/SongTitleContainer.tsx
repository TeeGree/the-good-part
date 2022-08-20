import Tooltip from '@mui/material/Tooltip'
import { IAudioMetadata } from 'music-metadata'
import React, { useEffect, useRef, useState } from 'react'
import classes from './SongTitleContainer.module.scss'

interface SongTitleContainerProps {
  nameOfFile?: string
  fileMetadata?: IAudioMetadata
}

export const SongTitleContainer: React.FC<SongTitleContainerProps> = (props: SongTitleContainerProps) => {
    const songTitleElementRef = useRef<HTMLInputElement | null>(null)
    const [showTooltip, setShouldShowTooltip] = useState(false)

    const getShouldShowTooltip = (): boolean => {
        const offsetWidth = songTitleElementRef?.current?.offsetWidth ?? 0
        const scrollWidth = songTitleElementRef?.current?.scrollWidth ?? 0
        return offsetWidth < scrollWidth
    }

    useEffect(() => {
        const handleResize = (): void => {
            setShouldShowTooltip(getShouldShowTooltip())
        }

        if (songTitleElementRef.current != null) {
            setShouldShowTooltip(getShouldShowTooltip())
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [songTitleElementRef])

    const getSongTitleContainer = (): JSX.Element => {
        return (
            <div className={classes.songTitleContainer}>
                {getSongTitle()}
                {getArtist()}
            </div>
        )
    }

    const getSongTitle = (): JSX.Element => {
        return (
            <div ref={songTitleElementRef} className={classes.songTitle}>
                {getSongTitleText()}
            </div>
        )
    }

    const getArtist = (): JSX.Element => {
        return (
            <div className={classes.artistName}>
                {getArtistText()}
            </div>
        )
    }

    const getArtistText = (): string => {
        return props.fileMetadata?.common?.artist ?? ''
    }

    const getSongTitleText = (): string => {
        const fallbackFilename = props.nameOfFile
        const title = props.fileMetadata?.common?.title

        if (title !== undefined) {
            return title
        } else if (fallbackFilename !== undefined) {
            return fallbackFilename
        }

        return 'Unknown'
    }

    const getSongHoverText = (): string => {
        let songInfoText = getSongTitleText()
        const artist = getArtistText()

        if (artist !== undefined) {
            songInfoText += ` by ${artist}`
        }

        return songInfoText
    }

    const getElements = (): JSX.Element => {
        if (showTooltip) {
            return (
                <Tooltip placement="top" title={getSongHoverText()}>
                    {getSongTitleContainer()}
                </Tooltip>
            )
        }

        return getSongTitleContainer()
    }

    return getElements()
}
