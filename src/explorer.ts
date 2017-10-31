import * as vscode from 'vscode';
import { TestRunnerAdapter, TestItem } from './adapter/api';

export class TestExplorer implements vscode.TreeDataProvider<TestExplorerItem> {

	private tree?: TestExplorerItem;
	private readonly treeDataChanged = new vscode.EventEmitter<TestExplorerItem>();
	public readonly onDidChangeTreeData: vscode.Event<TestExplorerItem>;

	constructor(
		private readonly adapter: TestRunnerAdapter
	) {
		this.onDidChangeTreeData = this.treeDataChanged.event;

		this.adapter.tests.subscribe((suite) => {
			this.tree = transform(suite);
			this.treeDataChanged.fire();
		});

		this.adapter.reloadTests();
	}

	getTreeItem(item: TestExplorerItem): vscode.TreeItem {
		return item;
	}

	getChildren(item?: TestExplorerItem): vscode.ProviderResult<TestExplorerItem[]> {
		const parent = item || this.tree;
		return parent ? parent.children : [];
	}
}

function transform(item: TestItem): TestExplorerItem {

	if (item.type === 'suite') {

		var children = item.children.map(transform);
		return new TestExplorerItem(item, children);

	} else {

		return new TestExplorerItem(item, []);
		
	}
}

class TestExplorerItem extends vscode.TreeItem {
	constructor(
		public readonly testItem: TestItem,
		public readonly children: TestExplorerItem[]
	) {
		super(testItem.label);
	}
}