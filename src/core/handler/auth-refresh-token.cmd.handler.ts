import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ITokenRepository } from 'src/domain/token.interface';
import { CLIENTS, User_GetByEmail } from 'vtonomy';
import { AuthRefreshTokenCommand } from '../command/auth-refresh-token';
import { AuthPayload } from '../dto/auth.dto';

@CommandHandler(AuthRefreshTokenCommand)
export class AuthRefreshTokenHandler
  implements ICommandHandler<AuthRefreshTokenCommand>
{
  constructor(
    @Inject(CLIENTS.User_Client) private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
    @Inject('ITokenRepository')
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: AuthRefreshTokenCommand): Promise<any> {
    const { refreshToken } = command.props;
    const refreshTokenSecret =
      process.env.REFRESH_TOKEN_SECRET ?? 'refresh_token_secret';

    let payload: AuthPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: refreshTokenSecret,
      });
    } catch (err) {
      await this.tokenRepository.deleteOne({ token: refreshToken });
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { email, role } = payload;

    const res = await firstValueFrom(
      this.userService.send(User_GetByEmail, { email, role }),
    );

    if (!res.success) {
      throw new UnauthorizedException('User not found');
    }

    const user = res.data;

    const newAccessToken = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET ?? 'access_token_secret',
        expiresIn: process.env.ACCESS_TOKEN_LIFE ?? '1h',
      },
    );

    return newAccessToken;
  }
}
