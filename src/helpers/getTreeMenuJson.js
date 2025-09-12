const getTreeMenuJson = (treeData) => {
  if (!treeData) return null;

  // Kalau sudah object → langsung return
  if (typeof treeData === 'object') {
    return treeData;
  }

  // Kalau string → coba parse
  if (typeof treeData === 'string') {
    try {
      return JSON.parse(treeData);
    } catch (err) {
      console.error('Invalid JSON string for treeData:', err);
      return null;
    }
  }

  // Tipe lain → null
  return null;
};

export default getTreeMenuJson;
