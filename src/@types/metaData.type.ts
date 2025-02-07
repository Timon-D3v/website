export interface MetaData {
    userId: number;
    fileName: string;
    lastModified: number;
    originalName: string;
    type: string;
    size: number;
    path: string;
    url: string;
    uploadedAt: number;
    timesOpened: number;
    lastOpened: number;
    timesDownloaded: number;
    lastDownloaded: number;
}

export interface MetaDataUpload {
    originalName: string;
    type: string;
    size: number;
    lastModified: number;
    uploadedAt: number;
    currentPath: string;
}
