import { IRepository } from 'vtonomy';

export interface IToken {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPersistant {}
export interface ITokenRepository
  extends IRepository<IToken, ITokenPersistant> {}
