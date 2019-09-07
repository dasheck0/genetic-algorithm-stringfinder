/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const { validateProfile, validateSuite } = require('../validation');
const geneticAlgorithm = require('../geneticAlgorithm');
const fitnessFunctions = require('../geneticAlgorithm/fitness');
const crossoverFunctions = require('../geneticAlgorithm/crossovers');
const matingFunctions = require('../geneticAlgorithm/matings');
const mutationFunctions = require('../geneticAlgorithm/mutations');
const utilities = require('../utilities');
const renderer = require('../renderer');

class Suite {
    static runSuite(suiteName, options = {}) {
        console.info(`Running suite ${suiteName}`);
        const suiteFileName = path.join(process.cwd(), 'input', 'suites', `${suiteName}.yml`);

        if (!fs.existsSync(suiteFileName)) {
            console.error(`Could not find suite ${suiteFileName}`);
            return;
        }

        const suite = YAML.load(suiteFileName);
        if (!validateSuite(suite)) {
            console.error(`Suite ${suiteName} is invalid`);
            return;
        }

        const now = (new Date()).getTime();
        suite.profiles.forEach((profile) => {
            Suite.runProfile(suite.word, profile, {
                output: suite.output,
                verbose: options.verbose,
                now,
                suiteName
            })
        })
    }

    static runProfile(word, profileName = 'default', options = {}) {
        console.log(`Running profile ${profileName}`);
        if (!word) {
            console.error('There is no word to search for');
            return;
        }

        const profileFileName = path.join(process.cwd(), 'input', 'profiles', `${profileName}.yml`);

        if (!fs.existsSync(profileFileName)) {
            console.error(`Could not find profile ${profileFileName}`);
            return;
        }

        const profile = YAML.load(profileFileName);
        if (!validateProfile(profile)) {
            console.error(`Profile ${profileName} is invalid`);
            return;
        }

        const generation0 = geneticAlgorithm.generatePopulation(profile.population.size, word.length, utilities.characterSet());
        const result = geneticAlgorithm.run(
            generation0,
            profile.population.limit,
            word,
            profile.mutation.chance,
            utilities.characterSet(),
            Suite.findStaticFunction(fitnessFunctions, profile.fitness.algorithm),
            Suite.findStaticFunction(matingFunctions, profile.mating.algorithm),
            Suite.findStaticFunction(crossoverFunctions, profile.crossover.algorithm),
            Suite.findStaticFunction(mutationFunctions, profile.mutation.algorithm),
            profile.generations.max,
            options.verbose.filter(entry => !!entry)
        );

        if (options.output) {
            const now = (new Date()).getTime();
            options.output.forEach((output) => {
                if (renderer[output]) {
                    renderer[output].render(result, {
                        profileName,
                        now: options.now || now,
                        suiteName: options.suiteName
                    });
                } else {
                    console.warn(`Output '${output}' is currently not supported`);
                }
            });
        } else {
            renderer.console.render(result);
        }
    }

    /* private */

    static findStaticFunction(object, functionName) {
        const functionObject = object[functionName];

        if (!functionObject) {
            console.error(`Could not find function ${functionName} in ${object.name}`);
            return null;
        }

        return functionObject;
    };
}

module.exports = Suite;