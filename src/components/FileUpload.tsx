import React from 'react';
import classes from './FileUpload.module.scss';
import Button from '@mui/material/Button';

interface FileUploadProps {
    label: string,
    onFileSelection: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

export const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps) => {
    
    return (
        <>
            <input id="fileUpload" type="file" className={classes.hidden} onChange={props.onFileSelection} />
            <label htmlFor="fileUpload">
                <Button variant="contained" color="primary" component="span">
                    {props.label}
                </Button>
            </label>
        </>
    );
};