const path = require('path');
const fs = require('fs');
const _flatten = require('lodash/flatten');
const shelljs = require('shelljs');
const minify = require('minify');
const crypto = require('crypto');

const EXCLUDE = [/node_modules/];

function splitFilePath(path) {
	const result = {
		file: path.split('/').reverse()[0],
		path: path.split('/').reverse().slice(1).reverse().join('/'),
	};
	result.extension = result.file.split('.').reverse()[0];

	return result;
}

function transformToHash(data, extension) {
	return crypto.createHash('md5').update(data).digest('hex') + '.' + extension;
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

function transform(folder, { covert: { pattern, to, outputPath, copy, hash } }, handler) {
	const searchPart = copy ? new RegExp(`(${pattern})|(${copy})`) : new RegExp(pattern);
	const pagesTSs = getFilePaths(folder, searchPart);
	const result = [];

	pagesTSs.fullPath.map((filePath, i) => {
		const outputFilePath = outputPath + pagesTSs.shortPath[i];
		const buildFolder = outputFilePath.split('/').reverse().slice(1).reverse().join('/');

		if (copy && new RegExp(copy).test(filePath)) {
			shelljs.mkdir('-p', buildFolder);
			shelljs.cp('-r', filePath, outputFilePath);
			return;
		}
		const code = fs.readFileSync(filePath);
		const handledCode = handler(code, pagesTSs.shortPath[i]);
		const divider = new Array(25).fill('-').join('');
		result.push(`/* ${divider} ${splitFilePath(filePath).file} */\n${handledCode.code}/* ${divider}END${divider} ${splitFilePath(filePath).file} */`);
	});

	const { extension, file } = splitFilePath(outputPath);
	let currentOutput = outputPath;
	if (hash) {
		const hashedName = transformToHash(result.join('\n'), extension);
		currentOutput = currentOutput.replace(file, hashedName);
	}

	fs.writeFileSync(currentOutput, result.join('\n'));
	return currentOutput;
};

function transformTS(folder, output, options = {}) {
	return transform(
		folder,
		{
			covert: {
				pattern: '\.ts$',
				to: 'js',
				outputPath: output,
				...options,
			},
		},
		function(code, path) {
			return require("@babel/core").transformSync(code, {
				presets: ["@babel/preset-typescript", "@babel/preset-env"],
				filename: path,
			})
		},
	);
}

function assignFiles(enterPath, pattern, output, options) {
	const files = getFiles(enterPath, pattern);
	const result = [];
	const divider = new Array(25).fill('-').join('');
	files.forEach((file) => {
		const code = fs.readFileSync(file);
		shelljs.mkdir('-p', output.split('/').reverse().slice(1).reverse().join('/'));
		result.push(`/* ${divider} ${splitFilePath(file).file} */\n${code}/* ${divider}END${divider} ${splitFilePath(file).file} */`);
	});

	const currentOutput = splitFilePath(output);
	if (options.hash) {
		currentOutput.file =
			crypto.createHash('md5').update(result.join('\n')).digest('hex') + '.' + currentOutput.extension;
	}

	const newOutput = path.join(currentOutput.path, currentOutput.file);
	fs.writeFileSync(newOutput, result.join('\n'));
	if (options.minify) {
		return minify(newOutput, {})
			.then(function(code) {
				fs.writeFileSync(newOutput, code);
				return newOutput;
			})
			.catch(console.error);
	} else {
		return Promise.resolve(newOutput);
	}
}

function collectHTML(templatePath, options) {
	try {
		let htmlTemplateFile = fs.readFileSync(templatePath).toString();
		htmlTemplateFile = htmlTemplateFile.replace(/XUI/, '/' + (options.publicPath || '') + options.js);
		htmlTemplateFile = htmlTemplateFile.replace(/XUI/, '/' + (options.publicPath || '') + options.css);

		const prefix = '{{define "' + options.templateName + '"}}\n';
		const postfix = '\n{{end}}'

		fs.writeFileSync(options.output, prefix + htmlTemplateFile + postfix);
	} catch(e) {
		console.error(e)
	}
}


// ----- EXECUTE ----- //
// (function() {
// 	const jsFile = transformTS(
// 		path.join(__dirname, '../templates'),
// 		path.join(__dirname, '../static/main.js'),
// 		{
// 			hash: process.env.NODE_ENV === 'production',
// 		},
// 	);
// 	assignFiles(
// 		path.join(__dirname, '../templates'),
// 		/\.css$/,
// 		path.join(__dirname, '../static/compile.css'),
// 		{
// 			minify: process.env.NODE_ENV === 'production',
// 			hash: process.env.NODE_ENV === 'production',
// 		},
// 	).then(function(cssFile) {
// 		collectHTML(path.join(__dirname, 'headTemplate.html'), {
// 			output: path.join(__dirname, '../templates/headTemplate.html'),
// 			js: splitFilePath(jsFile).file,
// 			css: splitFilePath(cssFile).file,
// 			templateName: 'head',
// // 		// });
// 	});
// })()

module.exports = {
	assignFiles,
	splitFilePath,
};
