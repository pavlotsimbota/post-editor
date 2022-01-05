const { collectHTML, splitFilePath } = require('./compiles');
const path = require("path");
const fs = require("fs");

module.exports = class CollectHTMLPlugin {
    constructor(options) {
        this.templatePath = options.templatePath;
        this.templateName = options.templateName;
        this.publicPath = options.publicPath;
        this.output = options.output;

        this.disabled = false;
    }

    apply(compiler) {
        if (this.disabled) return;

        compiler.hooks.done.tap('CollectHTMLPlugin', stats => {
            const assignFile = stats.compilation.assignPlugin || {}; // Till one CSS file
            const compiledFile = Object.keys(stats.compilation.assets)[0]; // Till one JS file

            collectHTML(this.templatePath, {
                templateName: this.templateName,
                publicPath: this.publicPath,
                output: this.output,
                css: assignFile.css,
                js: compiledFile,
            });

            this.disabled = true;
        })
    }
}