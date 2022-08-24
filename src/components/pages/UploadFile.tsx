import React, { ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import classes from './UploadFile.module.scss';

interface SelectFileProps {
    onLoadFile: (file: File) => Promise<void>;
    fileInputLabel: string;
}

export const UploadFile: React.FC<SelectFileProps> = (props: SelectFileProps) => {
    const { fileInputLabel, onLoadFile } = props;
    const openFile = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            onLoadFile(file);
        }
    };

    return (
        <div className={classes.playFileContainer}>
            <input id="fileUpload" type="file" className={classes.hidden} onChange={openFile} />
            <label htmlFor="fileUpload">
                <Button variant="contained" color="primary" component="span">
                    {fileInputLabel}
                </Button>
            </label>
        </div>
    );
};
