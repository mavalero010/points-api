module.exports = {
  'src/index.ts': (files) => {
    return [
      `prettier --write ${files.join(' ')}`,
      `eslint --fix --cache ${files.join(' ')}`,
    ];
  },
  'src/handlers/**/*.ts': (files) => {
    if (files.length === 0) return [];
    return [
      `prettier --write ${files.join(' ')}`,
      `eslint --fix --cache ${files.join(' ')}`,
    ];
  },
}; 