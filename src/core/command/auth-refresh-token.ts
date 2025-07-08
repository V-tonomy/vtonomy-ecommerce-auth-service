import { ICommand } from '@nestjs/cqrs';
import { AuthRefreshTokenDTO } from '../dto/auth.dto';
AuthRefreshTokenDTO;
export class AuthRefreshTokenCommand implements ICommand {
  public props: AuthRefreshTokenDTO;

  constructor(props: AuthRefreshTokenDTO) {
    this.props = props;
  }

  static create(props: AuthRefreshTokenDTO) {
    return new AuthRefreshTokenCommand(props);
  }
}
