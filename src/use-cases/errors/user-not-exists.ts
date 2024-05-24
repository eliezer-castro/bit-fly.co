export class UserNotExists extends Error {
  constructor() {
    super('Usuário não encontrado')
  }
}
