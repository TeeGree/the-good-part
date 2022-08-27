import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { Buffer } from 'buffer';
import * as process from 'process';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';
import { Library } from './components/pages/Library';
import { NavPanel } from './components/NavPanel';
import { getFilenameFromPath } from './utility/FilePathUtils';
import { SongInfo } from './models/SongInfo';
import { defaultVolume } from './redux/state/volumeState';
import { Playlists } from './components/pages/Playlists';

// Needed to polyfill dependencies that have been removed from Node.
window.Buffer = Buffer;
window.process = process;

Howler.volume(defaultVolume);

const App: React.FC = () => {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [playingSong, setPlayingSong] = useState<SongInfo>();
    const [playingPlaylistId, setPlayingPlaylistId] = useState<string | undefined>(undefined);
    const [nameOfFile, setNameOfFile] = useState<string>();
    const [playingSongId, setPlayingSongId] = useState<string>();
    const [playingSongIndex, setPlayingSongIndex] = useState<number>();
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [appSettings, setAppSettings] = useState<AppSettings>();

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setAppSettings(settings);
        });
    }, []);

    const clearPlayingSong = (): void => {
        setPlayingSound(undefined);
        setCurrentPlaybackTime(null);
        setTotalDuration(null);
        setPlayingSongId(undefined);
        setPlayingSong(undefined);
        setPlayingPlaylistId(undefined);
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
        const filename = getFilenameFromPath(filepath);

        const howlerSound = new Howl({
            src: [filepath],
            preload: true,
        });

        howlerSound.once('play', () => {
            setPlayingSong(song);
            setPlayingSound(howlerSound);
            setNameOfFile(filename);
            setTotalDuration(howlerSound.duration());
            if (songId !== undefined) {
                setPlayingSongId(songId);
                setPlayingSongIndex(index);
                setPlayingPlaylistId(playlistId);
                setHowlerEndCallback(howlerSound, index, playlistId);
            }

            if (isPaused) {
                setIsPaused(false);
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
                setPlayingSound(undefined);
                setPlayingSong(undefined);
                setPlayingSongId(undefined);
                setPlayingPlaylistId(undefined);
            }
        });
    };

    const pausePlayingSong = (shouldSetPauseState: boolean = true): void => {
        playingSound?.pause();
        if (shouldSetPauseState) {
            setIsPaused(true);
        }
    };

    const resumePlayingSong = (): void => {
        playingSound?.play();
        setIsPaused(false);
    };

    const seekToPosition = (pos: number): void => {
        if (playingSound !== undefined) {
            playingSound.once('play', () => {
                playingSound.seek(pos);
            });
        }
    };

    const getPlayingSongInfo = (): JSX.Element => {
        if (playingSound !== undefined) {
            return (
                <div className={classes.playingSongInfo}>
                    <PlayingSongInfo
                        nameOfFile={nameOfFile}
                        fileMetadata={playingSong?.metadata}
                        playingSound={playingSound}
                        onPause={pausePlayingSong}
                        onPlay={resumePlayingSong}
                        isPaused={isPaused}
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

    const uploadFile = async (file: File): Promise<void> => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        setAppSettings(settings);
        if (playingSongId !== undefined) {
            const index = settings.songs.findIndex((song) => song.id === playingSongId);
            if (index >= 0 && playingSound != null) {
                setHowlerEndCallback(playingSound, index);
            }
        }
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
                                    appSettings={appSettings}
                                    playSong={playSong}
                                    onPause={pausePlayingSong}
                                    onResume={resumePlayingSong}
                                    isPaused={isPaused}
                                    playingSongId={
                                        playingPlaylistId === undefined ? playingSongId : undefined
                                    }
                                    onLoadFile={uploadFile}
                                    fileInputLabel="Choose music file to add to library"
                                />
                            }
                        />
                        <Route
                            path="playlists"
                            element={
                                <Playlists appSettings={appSettings} playPlaylist={playPlaylist} />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
                <NavPanel />
                {getPlayingSongInfo()}
            </div>
        </div>
    );
};

export default App;
