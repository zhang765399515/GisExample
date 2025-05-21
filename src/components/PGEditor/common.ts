import * as monaco from 'monaco-editor'
/**
 * 自定义editor主题
 */
export const customTheme = () => {
  monaco.editor.defineTheme('power', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: 'D4D4D4', background: '1E1E1E' },
    ],
    colors: {
      'editor.background': '#1E1E1E00',
    }
  })
  monaco.editor.setTheme('power')
}

/**
 * 代码补全功能
 */
export const createCodePointer = () => {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: function (model, position) {
      // find out if we are completing a property in the 'dependencies' object.
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      const suggestions: any[] = [];
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      return { suggestions: suggestions };
    }
  })
}