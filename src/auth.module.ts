import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CLIENTS, RabbitmqModule, SagaModule } from 'vtonomy';
import { AUTH_HANDLER } from './core';
import { TokenSchema } from './domain/token.schema';
import { AuthController } from './infras/auth.transport';
import { TokenRepository } from './infras/token.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    RabbitmqModule,
    SagaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/ecommerce',
    ),
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'ITokenRepository',
      useClass: TokenRepository,
    },
    ...AUTH_HANDLER,
  ],
})
export class AuthModule {}
