/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const fs = require('fs');
const utilities = require('../utilities');

class GeneticAlgorithm {
    static run(firstGeneration, bestPopuplationLimit, destinationWord, mutationChance, characterSet, fitnessFunction, matingFunction, crossoverFunction, mutationFunction, runLimit, verbose) {
        let currentGeneration = firstGeneration;
        let result = {
            generationCount: -1,
            lastGeneration: [],
            generations: []
        };

        for (let i = 0; i < runLimit; i += 1) {
            if (verbose.length >= 1) {
                console.log(`Generation: ${i}`);
            }
            const testedPopulation = GeneticAlgorithm.testPopulation(currentGeneration, destinationWord, fitnessFunction);
            result.generations.push(testedPopulation);

            if (verbose.length >= 2) {
                console.log(`Population: ${testedPopulation}`);
            }

            currentGeneration = GeneticAlgorithm.mate(testedPopulation.map(p => p.chromosome), bestPopuplationLimit, matingFunction, crossoverFunction);
            currentGeneration = currentGeneration.map(chromosome => mutationFunction.call(null, chromosome, mutationChance, characterSet));

            result.generationCount = i;
            if (currentGeneration.some((chromosome) => chromosome === destinationWord)) {
                result.lastGeneration = currentGeneration;
                break;
            }
        }

        return result;
    }

    static generatePopulation(populationSize, destinationWordLength, characterSet) {
        const result = [];
        for (let i = 0; i < populationSize; i += 1) {
            result.push(utilities.randomWord(destinationWordLength, characterSet));
        }

        return result;
    };

    static testPopulation(population, destinationWord, fitnessFunction) {
        return population
            .map((chromosome) => {
                const fitness = 1 / fitnessFunction.call(null, destinationWord, chromosome);
                return {
                    chromosome,
                    fitness,
                    fitnessValue: 1 / fitness
                };
            })
            .sort((first, second) => first.fitnessValue - second.fitnessValue);
    };

    static mate(population, bestPopulationLimit, matingFunction, crossoverFunction) {
        const candidates = population.slice(0, bestPopulationLimit);
        return matingFunction.call(null, candidates, population.length - bestPopulationLimit, crossoverFunction).concat(candidates);
    }
}

module.exports = GeneticAlgorithm;