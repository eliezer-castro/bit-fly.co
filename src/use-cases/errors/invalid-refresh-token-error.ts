export class InvalidRefreshToken extends Error {
  constructor() {
    super('Invalid or expired refresh token')
  }
}
