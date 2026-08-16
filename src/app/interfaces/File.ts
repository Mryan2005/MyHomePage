export interface FileEntry {

    url: string;

    create_date: string;

    type: string;

    isPrivate: boolean;

    canOpen?: boolean;

}

export interface FileDirectory {

    [fileName: string]: FileEntry;

}

export interface FileGroup {

    [dirName: string]: FileDirectory;

}

export type FileTree = Record<string, FileGroup>;
