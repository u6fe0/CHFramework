'use strict';

module.exports = {
  load() {
    // 注册打开面板的消息
    Editor.Message.addBroadcastListener('node-tree:open', async () => {
      await Editor.Panel.open('node-tree-panel');
    });
  },
  unload() {},
};