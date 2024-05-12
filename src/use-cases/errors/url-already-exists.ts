export class UrlAlreadtExists extends Error {
  constructor() {
    super('URL ​​já está em uso')
  }
}
