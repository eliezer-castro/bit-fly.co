export class UrlNotExists extends Error {
  constructor() {
    super('URL não encontrada')
  }
}
