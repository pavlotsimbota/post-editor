const { assignFiles, splitFilePath } = require('./compiles');
const path = require("path");

module.exports = class AssignPlugin {
    constructor(options) {
        this.outputFile = {};
        this.entryPath = options.entryPath;
        this.patternFile = options.patternFile;
        this.output = options.output;
    }

    assign() {
        assignFiles(
            this.entryPath,
            this.patternFile,
            this.output,
            {
                minify: process.env.NODE_ENV === 'production',
                hash: process.env.NODE_ENV === 'production',
            },
        ).then((filePath) => {
            const { file, extension } = splitFilePath(filePath);
            this.outputFile = {
                [extension]: file,
            };
        })
    }

    apply(compiler) {
        this.assign();
        compiler.hooks.done.tap('AssignPlugin', stats => {
            stats.compilation.assignPlugin = this.outputFile;
        })
    }
}

// Compiler.webpack.util.createHash
// Compiler.webpack.Chunk
// Compiler.webpack.Hash