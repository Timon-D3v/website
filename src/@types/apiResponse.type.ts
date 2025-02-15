import { MetaFileSystem } from "./metaData.type";

export type ApiResponse = {
    message: string;
    error: boolean;
};

export type GetAllRoutesApiResponse = {
    message: string;
    error: boolean;
    fileSystem: MetaFileSystem | {};
};
