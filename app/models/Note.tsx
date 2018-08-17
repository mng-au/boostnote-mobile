import { Moment } from 'moment';

export interface IFolder {
  notes: INote[];
  folderName: string;
  folderKey: string;
  name: string;
}

export interface INote {
  fileName: string;
  content: string;
  createdAt: Moment;
  isStarred: boolean;
  updatedAt: Moment;
}
