export type Project = {
    id: number;
    title: string;
    description: string;
    url: string;
    image_url: string;
};

export type ProjectApiResponse = {
    projects: string;
    message: string;
    error: boolean;
};
