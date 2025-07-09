import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthLoginCommand,
  AuthRegisterCommand,
  AuthVerifyTokenCommand,
} from 'src/core/command';
import { AuthRefreshTokenCommand } from 'src/core/command/auth-refresh-token';
import {
  AuthLoginDTO,
  AuthRefreshTokenDTO,
  AuthRegisterDTO,
  AuthVerifyTokenDTO,
} from 'src/core/dto/auth.dto';
import { MessageResponseDTO, ResponseDTO } from 'vtonomy';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('register')
  public async register(@Body() registerDTO: AuthRegisterDTO) {
    const id = await this.commandBus.execute(
      AuthRegisterCommand.create(registerDTO),
    );
    return new MessageResponseDTO(`Success to add user with id: ${id}`);
  }

  @Post('login')
  public async login(@Body() loginDTO: AuthLoginDTO) {
    const data = await this.commandBus.execute(
      AuthLoginCommand.create(loginDTO),
    );

    return new ResponseDTO(data);
  }

  @Post('refresh')
  public async refresh(@Body() data: AuthRefreshTokenDTO) {
    const accessToken = await this.commandBus.execute(
      AuthRefreshTokenCommand.create(data),
    );

    return { data: accessToken };
  }

  @MessagePattern('auth.verify-token')
  async verify(@Payload() body: AuthVerifyTokenDTO) {
    const payload = await this.commandBus.execute(
      AuthVerifyTokenCommand.create(body),
    );

    return new ResponseDTO(payload);
  }
}
