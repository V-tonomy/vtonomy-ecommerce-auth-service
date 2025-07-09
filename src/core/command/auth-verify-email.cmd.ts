import { ICommand } from '@nestjs/cqrs';
import { AuthVerifyCodeDTO } from '../dto/auth.dto';

export class AuthVerifyCodeCommand implements ICommand {
  public props: AuthVerifyCodeDTO;

  constructor(props: AuthVerifyCodeDTO) {
    this.props = props;
  }

  static create(props: AuthVerifyCodeDTO) {
    return new AuthVerifyCodeCommand(props);
  }
}
