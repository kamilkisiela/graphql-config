// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- TODO: fix lint error
function ExtendableBuiltin<T extends Function>(cls: T): T {
  function ExtendableBuiltin(this: any, ...args) {
    cls.apply(this, args);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(ExtendableBuiltin, cls);

  return ExtendableBuiltin as any;
}

export function composeMessage(...lines: string[]): string {
  return lines.join('\n');
}

export class ConfigNotFoundError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class ConfigEmptyError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
// TODO: remove in v5
export class ConfigInvalidError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class ProjectNotFoundError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
// TODO: remove in v5
export class LoadersMissingError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
// TODO: remove in v5
export class LoaderNoResultError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class ExtensionMissingError extends ExtendableBuiltin(Error) {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
