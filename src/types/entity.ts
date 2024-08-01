export interface INote {
  _id: string;
  title: string;
  note: string;
}

export interface INoteResult {
  data: INote[];
}
