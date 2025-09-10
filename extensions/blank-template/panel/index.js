async function getNodeTree() {
  // 获取当前编辑场景中的根节点树
  const nodes = await Editor.Message.request('scene', 'query-node-tree');
  return nodes;
}

function createTreeElement(node) {
  const el = document.createElement('div');
  el.className = 'tree-node';
  el.innerText = node.name || '(无名节点)';
  el.style.marginLeft = `${node.__level * 12}px`;

  el.onclick = () => {
    Editor.Message.send('scene', 'select-node', node.uuid);
  };

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childEl = createTreeElement(child);
      el.appendChild(childEl);
    });
  }
  return el;
}

async function renderTree() {
  const treeContainer = document.getElementById('node-tree');
  treeContainer.innerHTML = '加载中...';

  const nodeTree = await getNodeTree();

  treeContainer.innerHTML = '';
  function visit(node, level = 0) {
    node.__level = level;
    const el = createTreeElement(node);
    treeContainer.appendChild(el);
    if (node.children) {
      node.children.forEach(child => visit(child, level + 1));
    }
  }
  visit(nodeTree, 0);
}

window.onload = renderTree;