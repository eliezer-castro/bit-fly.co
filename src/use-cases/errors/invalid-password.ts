export class InvalidPassword extends Error {
  constructor() {
    super('Senha atual incorreta')
  }
}
