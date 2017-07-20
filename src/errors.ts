function ExtendableBuiltin<T extends Function>(cls: T): T {
    function ExtendableBuiltin() {
        cls.apply(this, arguments);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin as any
}

export class ConfigNotFoundError extends ExtendableBuiltin(Error) {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name;
  }
}
