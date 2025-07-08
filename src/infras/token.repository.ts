import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/domain/token.entity';
import { TokenDocument } from 'src/domain/token.schema';
import { MongoRepository } from 'vtonomy';

@Injectable()
export class TokenRepository extends MongoRepository<Token, TokenDocument> {
  constructor(
    @InjectModel('Token')
    model: Model<TokenDocument>,
  ) {
    super(model);
  }

  toDomain(doc: TokenDocument): Token {
    return new Token(doc._id, doc.token, doc.createdAt, doc.updatedAt);
  }

  fromDomain(domain: Token): TokenDocument {
    return new this.model({
      _id: domain.id,
      token: domain.token,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
