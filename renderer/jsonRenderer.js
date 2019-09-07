/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const base = require('./fileBaseRenderer');

class FileRenderer {
    static render(input, data = {}) {
        const outputPath = base.getOutputPath(data);
        mkdirp.sync(outputPath);

        fs.writeFileSync(path.join(outputPath, `${base.getOutputFilename(data)}.json`), JSON.stringify(input, null, 2));
    }
}

module.exports = FileRenderer;