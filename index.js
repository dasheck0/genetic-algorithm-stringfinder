/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const geneticAlgorithm = require('./geneticAlgorithm');
const fitnessFunctions = require('./geneticAlgorithm/fitness');
const crossoverFunctions = require('./geneticAlgorithm/crossovers');
const matingFunctions = require('./geneticAlgorithm/matings');
const mutationFunctions = require('./geneticAlgorithm/mutations');

const destinationWord = 'Testing it now? Alright! Dann ist ja gut';
const characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!? ';
const populationSize = 250;
const bestPopulationLimit = 80;
const mutationChance = 0.05;
const runLimit = 20000;

const gen0 = geneticAlgorithm.generatePopulation(populationSize, destinationWord.length, characterSet);
geneticAlgorithm.run(gen0, bestPopulationLimit, destinationWord, mutationChance, characterSet, fitnessFunctions.sumDifference, matingFunctions.randomPick, crossoverFunctions.singlePointMiddleCrossover, mutationFunctions.singleCharacterMutation, runLimit);

