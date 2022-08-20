export const getFilenameFromPath = (filepath: string): string => {
    const filepathParts = filepath.split('\\')
    const lastFilePart = filepathParts[filepathParts.length - 1]
    return lastFilePart
}
