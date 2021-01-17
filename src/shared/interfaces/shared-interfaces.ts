export interface IProject {
  _id: string,
  name: string
}

export interface IComment {
  _id: string,
  title: string,
  detail: string,
  creator: {
    _id: string,
    name: string
  }
}

export interface IFormInputs {
  _id: string,
  category: string,
  title: string,
  description: string,
  limitDate: string,
  progress: number,
  status: string,
  personInCharge: string,
  comments?: IComment[],
  commentTitle: string;
  commentDetail: string;
}