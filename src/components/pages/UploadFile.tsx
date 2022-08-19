import { ChangeEvent } from 'react';
import classes from './UploadFile.module.scss';
import Button from '@mui/material/Button';

interface SelectFileProps {
    onLoadFile: (file: File) => Promise<void>
    fileInputLabel: string,
}

export const UploadFile: React.FC<SelectFileProps> = (props: SelectFileProps) => {
    const openFile = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            await props.onLoadFile(file);
        }
    }

    return (
        <div className={classes.playFileContainer}>
            <input id="fileUpload" type="file" className={classes.hidden} onChange={openFile} />
            <label htmlFor="fileUpload">
                <Button variant="contained" color="primary" component="span">
                    {props.fileInputLabel}
                </Button>
            </label>
        </div>
    );
}
