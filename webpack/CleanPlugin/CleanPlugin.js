const fs = require("fs");

module.exports = class CleanPlugin {
    purgeFolder(folder) {
        const files = fs.readdirSync(folder);
        files.forEach(function(file) {
            fs.unlinkSync(folder + '/' + file);
        });
    }

    apply(compiler) {
        this.purgeFolder(compiler.options.output.path);
    }
}