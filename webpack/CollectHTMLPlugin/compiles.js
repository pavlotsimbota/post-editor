const path = require('path');
const fs = require('fs');

function splitFilePath(path) {
	const result = {
		file: path.split('/').reverse()[0],
		path: path.split('/').reverse().slice(1).reverse().join('/'),
	};
	result.extension = result.file.split('.').reverse()[0];

	return result;
}

function getFilePaths(path, pattern) {
	const result = getFiles(path, pattern);
	return {
		shortPath: result.map(file => file.replace(path, '')),
		fullPath: result,
	};
}

function getFiles(path, pattern) {
	const ss = fs.readdirSync(path);
	const result = [];
	ss.forEach((item) => {
		const filePath = path + '/' + item;
		const stat = fs.statSync(filePath);
		if (EXCLUDE.find(ex => ex.test(filePath))) return;
		if (stat.isDirectory()) {
			result.push(getFiles(filePath, pattern));
		} else if (pattern.test(item)) {
			result.push(filePath);
		}
	});

	return _flatten(result);
}

function collectHTML(templatePath, options) {
	try {
		let htmlTemplateFile = fs.readFileSync(templatePath).toString();
		htmlTemplateFile = htmlTemplateFile.replace(/<!--JS-->/, (options.publicPath || '') + '/' + options.js);
		htmlTemplateFile = htmlTemplateFile.replace(/<!--CSS-->/, (options.publicPath || '') + '/' + options.css);

		const prefix = '{{define "' + options.templateName + '"}}\n';
		const postfix = '\n{{end}}'

		fs.writeFileSync(options.output, prefix + htmlTemplateFile + postfix);
	} catch(e) {
		console.error(e)
	}
}

module.exports = {
	splitFilePath,
	collectHTML,
};
