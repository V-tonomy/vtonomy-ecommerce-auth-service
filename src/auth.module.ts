import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CLIENTS } from 'vtonomy';
import { AUTH_HANDLER } from './core';
import { TokenSchema } from './domain/token.schema';
import { AuthController } from './infras/auth.transport';
import { TokenRepository } from './infras/token.repository';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/ecommerce',
    ),
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    ClientsModule.register([
      {
        name: CLIENTS.User_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: CLIENTS.Auth_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: CLIENTS.Notification_Client,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
          ],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
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
