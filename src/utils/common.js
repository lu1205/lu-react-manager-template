export const toTree = (arr) => {
  const tree = [];
  const map = new Map();

  arr.forEach((node) => {
    map.set(node.id, { ...node });
  });

  map.forEach((node, _, map) => {
    const parentId = node.pid;
    const parent = map.get(parentId);

    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};
