import React, { ChangeEvent } from 'react';
import { Button, Tooltip } from '@mui/material';
import { Upload } from '@mui/icons-material';
import classes from './UploadFileButton.module.scss';
import { useAppSettingsDispatch } from '../redux/Hooks';

interface UploadFileButtonProps {
    fileInputLabel: string;
}

export const UploadFileButton: React.FC<UploadFileButtonProps> = (props: UploadFileButtonProps) => {
    const appSettingsDispatch = useAppSettingsDispatch();
    const { fileInputLabel } = props;

    const uploadFile = async (file: File): Promise<void> => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
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
