import { IToken } from './token.interface';

export class Token implements IToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
