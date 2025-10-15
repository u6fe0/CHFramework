/**
 * EventTrigger.ts
 * 轻量事件总线（静态），按 event -> target -> handlers 组织。
 * - 自动随 target.onDestroy 解绑（仅对拥有 onDestroy 的对象，比如 Cocos 的 Component）。
 * - 派发使用快照，避免遍历过程中增删导致错乱。
 */
export type EventFlag = string | number | symbol;

export class EventTrigger {
  // event -> (target -> Set<handler>)
  private static _subscriptions = new Map<EventFlag, Map<object, Set<Function>>>();
  // 防重复包装 onDestroy
  private static _patchedDestroy = new WeakSet<object>();

  /**
   * 订阅事件
   */
  static on(eventFlag: EventFlag, handler: Function, target: object): void {
    if (typeof handler !== 'function') {
      console.error(`[EventTrigger] handler must be function when register ${String(eventFlag)}`);
      return;
    }
    let targetMap = this._subscriptions.get(eventFlag);
    if (!targetMap) {
      targetMap = new Map<object, Set<Function>>();
      this._subscriptions.set(eventFlag, targetMap);
    }
    let set = targetMap.get(target);
    if (!set) {
      set = new Set<Function>();
      targetMap.set(target, set);
      this.hookTargetDestroy(target);
    }
    if (!set.has(handler)) set.add(handler);
  }

  /**
   * 取消订阅
   */
  static off(eventFlag: EventFlag, handler: Function, target: object): void {
    const targetMap = this._subscriptions.get(eventFlag);
    if (!targetMap) return;
    const set = targetMap.get(target);
    if (!set) return;

    set.delete(handler);
    if (set.size === 0) {
      targetMap.delete(target);
      if (targetMap.size === 0) this._subscriptions.delete(eventFlag);
    }
  }

  /**
   * 清空事件（不传则清空全部）
   */
  static offAll(eventFlag?: EventFlag): void {
    if (eventFlag === undefined) {
      this._subscriptions.clear();
      return;
    }
    this._subscriptions.delete(eventFlag);
  }

  /**
   * 按目标清空（可选指定事件名）
   */
  static offAllByTarget(target: object, eventFlag?: EventFlag): void {
    if (eventFlag !== undefined) {
      this._subscriptions.get(eventFlag)?.delete(target);
      return;
    }
    for (const [, targetMap] of this._subscriptions) {
      targetMap.delete(target);
    }
  }

  /**
   * 派发事件
   */
  static dispatch(eventFlag: EventFlag, ...params: any[]): void {
    const targetMap = this._subscriptions.get(eventFlag);
    if (!targetMap || targetMap.size === 0) return;

    // 快照，防止遍历中被修改
    const entries = Array.from(targetMap.entries());
    for (const [target, set] of entries) {
      const handlers = Array.from(set);
      for (const h of handlers) {
        try {
          h.apply(target, params);
        } catch (err) {
          console.error(`[EventTrigger] handler error on "${String(eventFlag)}":`, err);
        }
      }
    }
  }

  /**
   * 自动解绑
   */
  private static hookTargetDestroy(target: object): void {
    if (this._patchedDestroy.has(target)) return;
    const t: any = target as any;
    const origin = t.onDestroy;
    if (typeof origin === 'function') {
      const self = this;
      t.onDestroy = function (...args: any[]) {
        try { self.offAllByTarget(this); }
        finally { return origin.apply(this, args); }
      };
      this._patchedDestroy.add(target);
    } else {
      // 非 Component 无法自动解绑，提示一次
      if (!(t as any).__evt_no_destroy_warned__) {
        console.warn('[EventTrigger] target has no onDestroy(). Auto-unsubscribe disabled. Pass a Component as target:', target);
        (t as any).__evt_no_destroy_warned__ = true;
      }
    }
  }
}