import fs = require('fs');
const docSimilarity = require('doc-similarity');

export function buildDatabase(testFiles: string[]): { [key: string]: string; } {
	let database: { [key: string]: string; } = {}
	for (const testFile of testFiles){
		let fileContent = fs.readFileSync(testFile,'utf8');
		database[testFile] = fileContent;
		console.log(fileContent);
	}
	return database;
}

export function bestTestFile(modified: string, database: { [key: string]: string; }): string {
	let chosenFile: string = "";
	let bestSim: number = 0;
	for (let key in database) {
		let tmp: number = docSimilarity.wordFrequencySim(fs.readFileSync(modified,'utf8'), database[key], docSimilarity.cosineSim);
		if (tmp > bestSim){
			bestSim = tmp;
			chosenFile = key;
		}
	}
	return chosenFile;
}