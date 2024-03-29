import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { Buffer } from 'buffer';
import * as process from 'process';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayingSongDock } from './components/PlayingSongDock';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';
import { Library } from './components/pages/Library';
import { NavPanel } from './components/NavPanel';
import { getFilenameFromPath } from './utility/FilePathUtils';
import { SongInfo } from './models/SongInfo';
import { defaultVolume } from './redux/state/volumeState';
import { Playlists } from './components/pages/Playlists';
import {
    useAppDispatch,
    useAppSettingsDispatch,
    useAppSettingsSelector,
    useIsPausedDispatch,
    useIsPausedSelector,
} from './redux/hooks';
import { PlaylistSummary } from './components/pages/PlaylistSummary';

// Needed to polyfill dependencies that have been removed from Node.
window.Buffer = Buffer;
window.process = process;

Howler.volume(defaultVolume);

interface PlayingSongInfo {
    songInfo: SongInfo | undefined;
    playlistId: string | undefined;
    howlerSound: Howl | undefined;
}

const initialPlayingSongInfo: PlayingSongInfo = {
    songInfo: undefined,
    playlistId: undefined,
    howlerSound: undefined,
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const appSettingsDispatch = useAppSettingsDispatch(dispatch);
    const isPausedDispatch = useIsPausedDispatch(dispatch);

    // TODO: Fix issue with appSettings not refreshing from 0 to 1 song.
    const appSettings = useAppSettingsSelector();
    const isPaused = useIsPausedSelector();

    const [playingSongInfo, setPlayingSongInfo] = useState<PlayingSongInfo>(initialPlayingSongInfo);
    const [playingSongIndex, setPlayingSongIndex] = useState<number>();
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number | null>(null);

    const {
        songInfo: playingSong,
        howlerSound: playingSound,
        playlistId: playingPlaylistId,
    } = playingSongInfo;

    const setAppSettings = (value: AppSettings): void => {
        appSettingsDispatch(value);
    };

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setAppSettings(settings);
        });
    }, []);

    useEffect(() => {
        if (playingSong?.id !== undefined) {
            const index = appSettings.songs.findIndex((song) => song.id === playingSong.id);
            if (index >= 0 && playingSound != null) {
                setHowlerEndCallback(playingSound, index);
            }
        }
    }, [appSettings]);

    const clearPlayingSong = (): void => {
        setCurrentPlaybackTime(null);
        setTotalDuration(null);
        setPlaybackStates(undefined, undefined, undefined);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound?.playing() === true) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                if (duration === playbackPosition) {
                    clearPlayingSong();
                } else {
                    setCurrentPlaybackTime(playbackPosition);
                    setTotalDuration(duration);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [playingSound]);

    const getSongId = (index: number, playlistId?: string): string => {
        if (playlistId !== undefined) {
            const playlist = appSettings?.playlistMap?.get(playlistId);
            if (playlist === undefined || playlist.songIds.length < index + 1) {
                throw Error('Invalid song index for playlist!');
            }

            return playlist.songIds[index];
        }

        const songId = appSettings?.songs[index].id;

        if (songId === undefined) {
            throw Error('Song index is invalid!');
        }

        return songId;
    };

    const setPlaybackStates = (
        song: SongInfo | undefined,
        sound: Howl | undefined,
        playlistId: string | undefined,
    ) => {
        setPlayingSongInfo({
            songInfo: song,
            howlerSound: sound,
            playlistId,
        });
    };

    const playSong = (index: number, playlistId?: string): void => {
        const songId = getSongId(index, playlistId);

        const song = appSettings?.songMap.get(songId);

        if (song === undefined) {
            throw Error('Song ID is invalid!');
        }

        if (
            playlistId !== undefined &&
            (appSettings?.playlistMap === undefined || !appSettings.playlistMap.has(playlistId))
        ) {
            throw Error('Playlist ID is invalid!');
        }

        const filepath = `.\\${song.filename}`;

        const howlerSound = new Howl({
            src: [filepath],
            preload: true,
        });

        howlerSound.once('play', () => {
            setPlaybackStates(song, howlerSound, playlistId);
            setPlayingSongIndex(index);
            setTotalDuration(howlerSound.duration());
            setHowlerEndCallback(howlerSound, index, playlistId);

            if (isPaused) {
                isPausedDispatch(false);
            }
        });

        if (playingSound != null) {
            playingSound.stop();
        }

        howlerSound.play();
    };

    const setHowlerEndCallback = (
        sound: Howl | undefined,
        index: number,
        playlistId?: string,
    ): void => {
        if (sound === undefined) {
            return;
        }
        sound.off('end');
        sound.once('end', () => {
            const length =
                (playlistId === undefined
                    ? appSettings?.songs?.length
                    : appSettings?.playlistMap?.get(playlistId)?.songIds?.length) ?? 0;
            if (index !== undefined && length > index + 1) {
                playSong(index + 1, playlistId);
            } else {
                setPlaybackStates(undefined, undefined, undefined);
            }
        });
    };

    const pausePlayingSong = (shouldSetPauseState: boolean = true): void => {
        playingSound?.pause();
        if (shouldSetPauseState) {
            isPausedDispatch(true);
        }
    };

    const resumePlayingSong = (): void => {
        playingSound?.play();
        isPausedDispatch(false);
    };

    const seekToPosition = (pos: number): void => {
        if (playingSound !== undefined) {
            playingSound.once('play', () => {
                playingSound.seek(pos);
            });
        }
    };

    const getFilename = (song: SongInfo | undefined): string => {
        if (song?.filename === undefined) {
            return '';
        }

        return getFilenameFromPath(song.filename);
    };

    const getPlayingSongDock = (): JSX.Element => {
        if (playingSound !== undefined) {
            return (
                <div className={classes.playingSongDock}>
                    <PlayingSongDock
                        nameOfFile={getFilename(playingSong)}
                        fileMetadata={playingSong?.metadata}
                        playingSound={playingSound}
                        onPause={pausePlayingSong}
                        onPlay={resumePlayingSong}
                        currentPlaybackTime={currentPlaybackTime}
                        totalDuration={totalDuration}
                        playNextSong={playNextSong}
                        playPreviousSong={playPreviousSong}
                        canPlayNextSong={canPlayNextSong()}
                        canPlayPreviousSong={canPlayPreviousSong()}
                        setPlaybackTime={setCurrentPlaybackTime}
                        seekToPosition={seekToPosition}
                    />
                </div>
            );
        }

        return <></>;
    };

    const getSongsLength = (): number => {
        const songs =
            playingPlaylistId === undefined
                ? appSettings?.songs
                : appSettings?.playlistMap?.get(playingPlaylistId)?.songIds;

        return songs?.length ?? 0;
    };

    const canPlayNextSong = (): boolean => {
        if (playingSongIndex === undefined) {
            return false;
        }

        const songsLength = getSongsLength();

        return playingSongIndex < songsLength - 1;
    };

    const canPlayPreviousSong = (): boolean => {
        if (playingSongIndex === undefined) {
            return false;
        }

        const songsLength = getSongsLength();

        return playingSongIndex > 0 && songsLength > 0;
    };

    const playNextSong = (): void => {
        if (playingSongIndex !== undefined) {
            playSong(playingSongIndex + 1, playingPlaylistId);
        }
    };

    const playPreviousSong = (): void => {
        if (playingSongIndex !== undefined) {
            playSong(playingSongIndex - 1, playingPlaylistId);
        }
    };

    const playPlaylist = (playlistId: string): void => {
        playSong(0, playlistId);
    };

    return (
        <div className={classes.app}>
            <div className={classes.appContainer}>
                <div className={classes.mainContent}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Library
                                    playSong={playSong}
                                    onPause={pausePlayingSong}
                                    onResume={resumePlayingSong}
                                    playingSongId={
                                        playingPlaylistId === undefined
                                            ? playingSong?.id
                                            : undefined
                                    }
                                    fileInputLabel="Choose music file to add to library"
                                />
                            }
                        />
                        <Route
                            path="/playlists"
                            element={<Playlists playPlaylist={playPlaylist} />}
                        />
                        <Route
                            path="/playlistSummary/:id"
                            element={
                                <PlaylistSummary
                                    playSong={playSong}
                                    onPause={pausePlayingSong}
                                    onResume={resumePlayingSong}
                                    playingSongId={playingSong?.id}
                                />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
                <NavPanel />
                {getPlayingSongDock()}
            </div>
        </div>
    );
};

export default App;
