
export interface InquirerError extends Error {
  name: string;
}

export class ScraperError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ScraperError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class InitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Init Error'
  }
}
