import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { ITokenRepository } from 'src/domain/token.interface';
import { Token } from 'src/domain/token.entity';
import { CLIENTS, User_GetByEmail } from 'vtonomy';
import { AuthLoginCommand } from '../command';

@CommandHandler(AuthLoginCommand)
export class AuthLoginHandler implements ICommandHandler<AuthLoginCommand> {
  constructor(
    @Inject(CLIENTS.User_Client) private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
    @Inject('ITokenRepository')
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: AuthLoginCommand): Promise<any> {
    const { email, password, role } = command.props;

    const res = await firstValueFrom(
      this.userService.send(User_GetByEmail, { email, role }),
    );

    if (!res.success) {
      throw new BadRequestException(res.error);
    }

    const user = res.data;

    if (!user || !bcrypt.compareSync(password, user?.password)) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET ?? 'accessToken',
      expiresIn: process.env.ACCESS_TOKEN_LIFE ?? '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET ?? 'refreshToken',
      expiresIn: process.env.REFRESH_TOKEN_LIFE ?? '24h',
    });

    const token: Token = {
      id: randomUUID(),
      token: refreshToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.tokenRepository.insert(token);

    return { accessToken, refreshToken };
  }
}
