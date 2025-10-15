import type { InjectionKey } from 'vue';

import type { MessageOptions, MessageHandler } from 'element-plus';

export const keyAppRoot = Symbol() as InjectionKey<HTMLElement>;

export const keyMessage = Symbol() as InjectionKey<(options?: MessageOptions) => MessageHandler>;
