/**
 * UI 视图唯一标识
 */

export class UIKey {
  path: string;
  get Path() {
    return this.path;
  }
  bundle: string;

  constructor(
    path: string,
    bundle: string) {
    this.path = path;
    this.bundle = bundle;
  }
}