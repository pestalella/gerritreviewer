// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

//import * as fetch from 'node-fetch';
const fetch = require('node-fetch');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('GerritReviewer is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gerritreviewer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from GerritReviewer!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand('gerritreviewer.getReviews', () => {
		  // Create and show panel
		  const panel = vscode.window.createWebviewPanel(
			'gerritReviews',
			'Available Gerrit reviews',
			vscode.ViewColumn.One,
			{}
		  );

		  var url = vscode.workspace.getConfiguration('gerritreviewer').get('gerritURL', '');
		  console.log('url from config:[' + url + ']');
		  // And set its HTML content
		  getListOfChanges(url).then(jsonVar => {
			var jsonStr = JSON.stringify(jsonVar[0]);
			panel.webview.html = jsonStr;});
		})
	  );
}

async function getListOfChanges(url:string)  {
	const reqChanges = url + "/changes/?q=status:open";
	console.log("Launching request [" + reqChanges + "]");
	return fetch(reqChanges)
		.then((res : any) => res.text())
		.then((text : any) => JSON.parse(text.slice(5)))
		.catch((err : any) => console.error(err));
}

// this method is called when your extension is deactivated
export function deactivate() {}
