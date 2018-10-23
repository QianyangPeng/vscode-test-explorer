import fs = require('fs');

export function buildDatabase(testFiles: string[]): { [key: string]: string; } {
	let database: { [key: string]: string; } = {}
	for (const testFile of testFiles){
		let fileContent = fs.readFileSync(testFile,'utf8');
		database[testFile] = fileContent
		console.log(fileContent)
	}
	return database
}
