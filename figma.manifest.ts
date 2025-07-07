// https://www.figma.com/plugin-docs/manifest/
export default {
  name: 'figma2acf',
  id: '1492345579098705021',
  api: '1.0.0',
  main: 'plugin.js',
  ui: 'index.html',
  enableProposedApi: false,
  editorType: ['dev', 'figma'],
  capabilities: ['codegen', 'vscode'],
  codegenLanguages: [{ label: 'HTML', value: 'html' }],
};
