export class UIKey {
  private readonly __brand = 'UIKey';
  constructor(public readonly name: string) {}
  toString() { return this.name; }
}