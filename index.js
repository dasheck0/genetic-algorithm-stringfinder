/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const YAML = require('yamljs');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const path = require('path');

const { validateProfile } = require('./validation');

const geneticAlgorithm = require('./geneticAlgorithm');
const fitnessFunctions = require('./geneticAlgorithm/fitness');
const crossoverFunctions = require('./geneticAlgorithm/crossovers');
const matingFunctions = require('./geneticAlgorithm/matings');
const mutationFunctions = require('./geneticAlgorithm/mutations');
const utilities = require('./utilities');
const renderer = require('./renderer');

const optionDefinitions = [
    { name: 'profile', alias: 'p', type: String },
    { name: 'word', alias: 'w', type: String, defaultOption: true },
    { name: 'verbose', alias: 'v', type: Boolean, lazyMultiple: true },
    { name: 'output', alias: 'o', type: String, lazyMultiple: true }
];
const options = commandLineArgs(optionDefinitions);

if (!options.word) {
    console.error('There is no word to search for');
    process.exit(1);
}

const profileName = options.profile || 'default';
const profileFileName = path.join(process.cwd(), 'profiles', `${profileName}.yml`);

if (!fs.existsSync(profileFileName)) {
    console.error(`Could not find profile ${profileFileName}`);
    process.exit(1);
}

const profile = YAML.load(profileFileName);
if (!validateProfile(profile)) {
    console.error(`Profile ${profileName} is invalid`);
    process.exit(1);
}

const findStaticFunction = (object, functionName) => {
    const functionObject = object[functionName];

    if (!functionObject) {
        console.error(`Could not find function ${functionName} in ${object.name}`);
        process.exit(1);
    }

    return functionObject;
};

const generation0 = geneticAlgorithm.generatePopulation(profile.population.size, options.word.length, utilities.characterSet());
const result = geneticAlgorithm.run(
    generation0,
    profile.population.limit,
    options.word,
    profile.mutation.chance,
    utilities.characterSet(),
    findStaticFunction(fitnessFunctions, profile.fitness.algorithm),
    findStaticFunction(matingFunctions, profile.mating.algorithm),
    findStaticFunction(crossoverFunctions, profile.crossover.algorithm),
    findStaticFunction(mutationFunctions, profile.mutation.algorithm),
    profile.generations.max,
    options.verbose.filter(entry => !!entry)
);

if (options.output) {
    options.output.forEach((output) => {
        if (renderer[output]) {
            renderer[output].render(result, { profile: profileName, now: (new Date()).getTime() });
        } else {
            console.warn(`Output '${output}' is currently not supported`);
        }
    });
} else {
    renderer.console.render(result);
}