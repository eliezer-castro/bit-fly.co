export class MissingFields extends Error {
  constructor() {
    super('Campos obrigatórios não encontrados')
  }
}
