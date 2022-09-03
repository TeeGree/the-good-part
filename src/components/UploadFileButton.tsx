import React, { ChangeEvent } from 'react';
import { Button, Tooltip } from '@mui/material';
import { Upload } from '@mui/icons-material';
import classes from './UploadFileButton.module.scss';
import { useAppDispatch } from '../redux/Hooks';
import { AppSettings } from '../models/AppSettings';
import { SET_APP_SETTINGS } from '../redux/actions/AppSettingsActions';

interface UploadFileButtonProps {
    fileInputLabel: string;
}

export const UploadFileButton: React.FC<UploadFileButtonProps> = (props: UploadFileButtonProps) => {
    const dispatch = useAppDispatch();
    const { fileInputLabel } = props;

    const setAppSettings = (value: AppSettings): void => {
        dispatch({ type: SET_APP_SETTINGS, appSettings: value });
    };

    const uploadFile = async (file: File): Promise<void> => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        setAppSettings(settings);
    };

    const openFile = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            uploadFile(file);
        }
    };

    return (
        <Tooltip title={fileInputLabel}>
            <label htmlFor="fileUpload">
                <input id="fileUpload" type="file" className={classes.hidden} onChange={openFile} />
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
    );
};
