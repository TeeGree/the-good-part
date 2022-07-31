import React from 'react';
import { AppSettings } from '../../models/AppSettings';

interface LibraryProps {
    appSettings: AppSettings | undefined,
    playSong: (filepath: string) => void
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    return (
        <div>
            Welcome to the library.
        </div>
    );
}
