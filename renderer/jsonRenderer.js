/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

class FileRenderer {
    static render(input, data = {}) {
        mkdirp.sync(path.join(process.cwd(), 'output', data.profile));
        fs.writeFileSync(path.join(process.cwd(), 'output', data.profile, `${data.now}.json`), JSON.stringify(input, null, 2));
    }
}

module.exports = FileRenderer;