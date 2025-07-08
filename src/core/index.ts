import { AuthLoginHandler, RegisterHandler } from './handler';
import { AuthRegisterHandler } from './handler/auth-refresh-token.cmd.handler';
import { AuthVerifyHandler } from './handler/auth-verify.cmd.handler';

export const AUTH_HANDLER = [
  RegisterHandler,
  AuthLoginHandler,
  AuthVerifyHandler,
  AuthRegisterHandler,
];
