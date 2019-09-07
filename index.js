/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

const commandLineArgs = require('command-line-args');
const suite = require('./suites');

const optionDefinitions = [
    { name: 'profile', alias: 'p', type: String },
    { name: 'word', alias: 'w', type: String, defaultOption: true },
    { name: 'verbose', alias: 'v', type: Boolean, lazyMultiple: true },
    { name: 'output', alias: 'o', type: String, lazyMultiple: true },
    { name: 'suite', alias: 's', type: String }
];
const options = commandLineArgs(optionDefinitions);

if (options.suite) {
    suite.runSuite(options.suite, options);
} else {
    suite.runProfile(options.word, options.profile, options);
}
