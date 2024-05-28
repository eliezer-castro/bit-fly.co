export class UrlNotExists extends Error {
  constructor() {
    super('URL not found')
  }
}
