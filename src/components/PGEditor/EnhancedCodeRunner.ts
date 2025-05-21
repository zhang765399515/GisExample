import * as monaco from 'monaco-editor';

class EnhancedCodeRunner {
    private editor: monaco.editor.IStandaloneCodeEditor;
    private outputDiv: HTMLDivElement;
    private isRunning: boolean = false;
    private currentExecution: any = null;

    constructor(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor;
        this.outputDiv = this.createOutputPanel();
        this.setupButtons();
        this.setupAutoComplete();
    }

    private createOutputPanel(): HTMLDivElement {
        const container = document.createElement('div');
        container.className = 'runner-container';

        const output = document.createElement('div');
        output.className = 'output-panel';

        this.editor.getDomNode()?.parentElement?.appendChild(container);
        container.appendChild(output);
        return output;
    }

    private setupButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'dhy_control-button';
        buttonContainer.style.cssText = `
            height: 30px;
            background: #2d2d2d;
        `;

        // Run button
        const runButton = document.createElement('button');
        runButton.textContent = 'Run 运行 (Ctrl+Enter)';
        runButton.onclick = () => this.runCode();

        // Stop button
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop 停止';
        stopButton.onclick = () => this.stopExecution();

        // Clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Output (清除输出)';
        clearButton.onclick = () => this.clearOutput();

        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(stopButton);
        buttonContainer.appendChild(clearButton);

        this.editor.getDomNode()?.parentElement?.prepend(buttonContainer);

        // Add keyboard shortcuts
        this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            this.runCode();
        });
    }

    private setupAutoComplete() {
        // Add custom suggestions
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: () => {
                const suggestions = [
                    {
                        label: 'console.log',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'console.log(${1:value});',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'async function',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'async function ${1:name}() {',
                            '\t${2}',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }
                ];
                return { suggestions };
            }
        });
    }

    private async runCode() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        const code = this.editor.getValue();
        console.log(code);
        
        this.outputDiv.innerHTML = '';

        try {
            const consoleLogs: any[] = [];
            const sandbox = {
                console: {
                    log: (...args: any[]) => {
                        consoleLogs.push(args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                        ).join(' '));
                        this.updateOutput(consoleLogs);
                    },
                    error: (...args: any[]) => {
                        consoleLogs.push(`<span style="color: red">${args.join(' ')}</span>`);
                        this.updateOutput(consoleLogs);
                    }
                },
                setTimeout,
                setInterval,
                clearTimeout,
                clearInterval,
                fetch
            };

            const runnable = new Function(...Object.keys(sandbox), `
                return (async () => {
                    try {
                        ${code}
                    } catch (error) {
                        console.error('Error:', error.message);
                    }
                })();
            `);

            this.currentExecution = runnable.call(null, ...Object.values(sandbox));
            await this.currentExecution;

        } catch (error) {
            this.outputDiv.innerHTML += `<div style="color: red">Error: ${error}</div>`;
        } finally {
            this.isRunning = false;
            this.currentExecution = null;
        }
    }

    private stopExecution() {
        if (this.currentExecution && this.currentExecution.cancel) {
            this.currentExecution.cancel();
        }
        this.isRunning = false;
        this.outputDiv.innerHTML += '<div style="color: yellow">Execution stopped</div>';
    }

    private clearOutput() {
        this.outputDiv.innerHTML = '';
    }

    private updateOutput(logs: string[]) {
        this.outputDiv.innerHTML = logs.map(log =>
            `<div>${log}</div>`
        ).join('');
        this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
    }
}

export default EnhancedCodeRunner
