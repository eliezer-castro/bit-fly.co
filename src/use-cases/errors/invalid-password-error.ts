export class InvalidPassword extends Error {
  constructor() {
    super('Incorrect current password')
  }
}
