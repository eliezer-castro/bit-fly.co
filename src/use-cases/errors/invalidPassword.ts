export class InvalidPassword extends Error {
  constructor() {
    super('Senha inválida')
  }
}
