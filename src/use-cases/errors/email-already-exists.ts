export class EmailAlreadyExists extends Error {
  constructor() {
    super('E-mail already registered')
  }
}
