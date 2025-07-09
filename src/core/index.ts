import {
  AuthLoginHandler,
  AuthRefreshTokenHandler,
  AuthRegisterHandler,
  AuthVerifyTokenHandler,
} from './handler';

export const AUTH_HANDLER = [
  AuthLoginHandler,
  AuthVerifyTokenHandler,
  AuthRegisterHandler,
  AuthRefreshTokenHandler,
];
