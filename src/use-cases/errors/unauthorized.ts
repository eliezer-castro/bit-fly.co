export class Unauthorized extends Error {
  constructor() {
    super('Não autorizado')
  }
}
