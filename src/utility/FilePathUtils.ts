export const getFilenameFromPath = (filepath: string): string => {
    const replaced = filepath.replace(/\//g, '\\');
    const filepathParts = replaced.split('\\');
    const lastFilePart = filepathParts[filepathParts.length - 1];
    return lastFilePart;
};

export const getFilenameWithoutExtension = (filename: string): string => {
    if (filename.includes('.')) {
        return filename.split('.')[0];
    }

    return filename;
};
