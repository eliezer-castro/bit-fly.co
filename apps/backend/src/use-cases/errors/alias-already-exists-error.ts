export class AliasAlreadyExists extends Error {
  constructor() {
    super('Alias ​​is already in use')
  }
}
