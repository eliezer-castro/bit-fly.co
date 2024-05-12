export class AliasAlreadyExists extends Error {
  constructor() {
    super('Alias ​​já está em uso')
  }
}
