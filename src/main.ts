import * as vscode from 'vscode';
import { TestHub as ITestHub} from 'vscode-test-adapter-api';
import { TestHub } from './hub/testHub';
import { TestExplorer } from './testExplorer';
import { runTestsInFile, runTestAtCursor, debugTestAtCursor } from './util';

export function activate(context: vscode.ExtensionContext): ITestHub {

	const hub = new TestHub();
	const testExplorer = new TestExplorer(context);
	hub.registerTestController(testExplorer);

	const registerCommand = (command: string, callback: (...args: any[]) => any) => {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	};

	registerCommand('test-explorer.reload', () => testExplorer.reload());

	registerCommand('test-explorer.reload-collection', (node) => testExplorer.reload(node));

	registerCommand('test-explorer.reloading', () => {});

	registerCommand('test-explorer.run-all', () => testExplorer.run());

	registerCommand('test-explorer.run', (...nodes) => testExplorer.run(nodes));

	registerCommand('test-explorer.run-selected', () => testExplorer.runSelectedTests());

	registerCommand('test-explorer.run-file', (file?: string) => runTestsInFile(file, testExplorer));

	registerCommand('test-explorer.run-test-at-cursor', () => runTestAtCursor(testExplorer));

	registerCommand('test-explorer.debug-test-at-cursor', () => debugTestAtCursor(testExplorer));

	registerCommand('test-explorer.cancel', () => testExplorer.cancel());

	registerCommand('test-explorer.debug', (...nodes) => testExplorer.debug(nodes));

	registerCommand('test-explorer.show-error', (message) => testExplorer.showError(message));

	registerCommand('test-explorer.show-source', (node) => testExplorer.showSource(node));

	registerCommand('test-explorer.enable-autorun', (node) => testExplorer.setAutorun(node));

	registerCommand('test-explorer.disable-autorun', (node) => testExplorer.clearAutorun(node));

	registerCommand('test-explorer.retire', (node) => testExplorer.retireState(node));

	registerCommand('test-explorer.reset', (node) => testExplorer.resetState(node));

	context.subscriptions.push(vscode.window.registerTreeDataProvider('test-explorer', testExplorer));

	const documentSelector = { pattern: '**/*' };
	context.subscriptions.push(vscode.languages.registerCodeLensProvider(documentSelector, testExplorer));

	vscode.workspace.onDidSaveTextDocument(function(e: vscode.TextDocument) { testExplorer.updateSelect(e.fileName); }, undefined);

	return {
		registerAdapter: adapter => hub.registerAdapter(adapter),
		unregisterAdapter: adapter => hub.unregisterAdapter(adapter),
		registerTestAdapter: adapter => hub.registerTestAdapter(adapter),
		unregisterTestAdapter: adapter => hub.unregisterTestAdapter(adapter),
		registerTestController: controller => hub.registerTestController(controller),
		unregisterTestController: controller => hub.unregisterTestController(controller)
	}
}
