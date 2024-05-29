export class MissingFields extends Error {
  constructor() {
    super('Required fields not found')
  }
}
