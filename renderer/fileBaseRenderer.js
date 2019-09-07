/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

const path = require('path');

class FileBaseRenderer {
    static getOutputPath(data) {
        if(data.suiteName) {
            return path.join(process.cwd(), 'output', 'suites', data.suiteName, String(data.now));
        } else {
            return path.join(process.cwd(), 'output', 'profiles', data.profileName, String(data.now));
        }
    }

    static getOutputFilename(data) {
        return data.profileName;
        if(data.suiteName) {
            return data.profileName;
        } else {
            return 'output';
        }
    }
}

module.exports = FileBaseRenderer;