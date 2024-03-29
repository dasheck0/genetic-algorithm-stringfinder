/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const { validateProfile, validateSuite } = require('../validation');
const geneticAlgorithm = require('../geneticAlgorithm');
const fitnessFunctions = require('../geneticAlgorithm/fitness');
const crossoverFunctions = require('../geneticAlgorithm/crossovers');
const matingFunctions = require('../geneticAlgorithm/matings');
const mutationFunctions = require('../geneticAlgorithm/mutations');
const utilities = require('../utilities');
const renderer = require('../renderer');
const fileBaseRenderer = require('../renderer/fileBaseRenderer');


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

        const suiteOptions = {
            output: suite.output,
            verbose: options.verbose || [],
            now: (new Date()).getTime(),
            suiteName,
            overrides: suite.overrides || {}
        };

        const results = suite.profiles.map((profile) => Suite.runProfile(suite.word, profile, suiteOptions));

        const outputPath = fileBaseRenderer.getOutputPath(suiteOptions);
        mkdirp.sync(outputPath);
        fs.writeFileSync(path.join(outputPath, 'report.json'), JSON.stringify({
            results: results.sort((a, b) => a.generationCount - b.generationCount).map(result => ({
                name: result.profileName,
                generations: result.generationCount
            }))
        }, null, 2));
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
            (options.overrides.generations || {}).max || profile.generations.max,
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

        result.word = word;
        result.profileName = profileName;
        return result;
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