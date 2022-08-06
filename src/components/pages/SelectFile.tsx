import React from 'react';
import { FileUpload } from '../FileUpload';

interface SelectFileProps {
    onLoadFile: (file: File) => Promise<void>
    fileInputLabel: string,
}

export const SelectFile: React.FC<SelectFileProps> = (props: SelectFileProps) => {
    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            await props.onLoadFile(file);
        }
    }

    return (
        <FileUpload label={props.fileInputLabel} onFileSelection={openFile} />
    );
}
