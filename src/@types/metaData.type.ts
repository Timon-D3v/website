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

export interface MetaFile {
    id: number;
    email: string;
    name: string;
    familyName: string;
    picture: string;
    fileSystem: MetaFileSystem;
}

export interface MetaFileSystem {
    [root: string]: MetaFolder;
    [key: `root/${string}`]: MetaFolder;
}

export interface MetaFolder {
    name: string;
    files: MetaData[];
    folders: string[];
}

export interface DatabaseFile {
    id: number;
    filename: string;
    ownerId: number;
    isPublic: boolean;
    data: Buffer;
    mimetype: string;
    originalName: string;
}

export interface DatabaseChunk {
    id: number;
    ownerId: number;
    chunkId: string;
    chunkIndex: number;
    totalChunks: number;
    chunk: Buffer;
}