export interface IBase {
  id: number;
}

export interface IBasePublic {
  //public key
  instance_id: string;
}

export interface IBaseDate {
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseUser {
  role: number;
  group_id: number;
}

export interface IBaseRespon {
  result: boolean;
}

export interface IJsonRespon {
  value: string;
}

export interface IDataBaseResult {
  result: boolean;
  value: any;
}