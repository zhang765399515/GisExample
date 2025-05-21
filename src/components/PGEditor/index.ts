import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as monaco from 'monaco-editor';
import EnhancedCodeRunner from "./EnhancedCodeRunner"

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (['css', 'scss', 'less'].includes(label)) {
      return new cssWorker()
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      return new htmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  },
}

let editorInstance: monaco.editor.IStandaloneCodeEditor

export const initPGEditor = (domRef: HTMLElement) => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
  });

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: ``, // 初始显示文字
    language: 'typescript', // 语言支持
    theme: 'vs-dark', // 主题色官方自带： vs, hc-black , vs-dark
    automaticLayout: true, // 自适应布局 默认true
    renderLineHighlight: 'all', // 行亮方式 默认all
    selectOnLineNumbers: true, // 显示行号 默认true
    minimap: {
      autohide: true,
      enabled: true,
    },
    readOnly: false, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白
    overviewRulerBorder: false, // 不要滚动条的边框
  }
  editorInstance = monaco.editor.create(domRef, options);

  const runner = new EnhancedCodeRunner(editorInstance);
  // customTheme();
  watchEditorStatus();
}

export const watchEditorStatus = () => {
  editorInstance?.onDidChangeModelContent((status: any) => {
    const modelVal = editorInstance?.getValue();
  })
}

export async function fetchScript(id: string) {
  const filePath = `${process.env.EXAMPLE_SOURCE_PATH}/${id}/map.ts`
  const currScript = await fetch(filePath);
  const originScript = await currScript.text();
  editorInstance.setValue(originScript);

  const fileExtension = filePath.split('.').pop();
  const language = getLanguageFromExtension(fileExtension);
  monaco.editor.setModelLanguage(editorInstance.getModel()!, language);
};

function getLanguageFromExtension(ext: string | undefined): string {
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'js': 'javascript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    // Add more mappings as needed
  };
  return ext ? (languageMap[ext] || 'plaintext') : 'plaintext';
}