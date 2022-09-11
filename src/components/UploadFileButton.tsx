import React, { ChangeEvent, useState } from 'react';
import { Button, Snackbar, Tooltip } from '@mui/material';
import { Upload } from '@mui/icons-material';
import classes from './UploadFileButton.module.scss';
import { useAppSettingsDispatch, useAppSettingsSelector } from '../redux/hooks';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SongInfo } from '../models/SongInfo';

interface UploadFileButtonProps {
    fileInputLabel: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const UploadFileButton: React.FC<UploadFileButtonProps> = (props: UploadFileButtonProps) => {
    const appSettings = useAppSettingsSelector();
    const appSettingsDispatch = useAppSettingsDispatch();
    const { fileInputLabel } = props;
    const [errorMessage, setErrorMessage] = useState('');

    const uploadFile = async (file: File): Promise<void> => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const openFile = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            if (appSettings.songs.findIndex((song: SongInfo) => song.filename === file.name) >= 0) {
                setErrorMessage(
                    `Upload failed. File "${file.name}" already exists in the library!`,
                );
            } else {
                uploadFile(file);
            }
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorMessage('');
    };

    return (
        <>
            <Snackbar open={errorMessage !== ''} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Tooltip title={fileInputLabel}>
                <label htmlFor="fileUpload">
                    <input
                        id="fileUpload"
                        type="file"
                        className={classes.hidden}
                        onChange={openFile}
                    />
                    <Button
                        className={classes.uploadButton}
                        variant="contained"
                        sx={{ color: '#ffffff', margin: '5px', backgroundColor: '#36a5ef' }}
                        component="span"
                    >
                        <Upload />
                    </Button>
                </label>
            </Tooltip>
        </>
    );
};
