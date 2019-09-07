/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

const utilities = require('../utilities');

class Matings {
    static randomPick(candidates, destinationSize, crossoverFunction) {
        const newPopulation = [];

        do {
            const firstIndex = utilities.randomIndex(candidates);
            const firstChromosome = candidates[firstIndex];

            let secondIndex;
            do {
                secondIndex = utilities.randomIndex(candidates);
            } while (secondIndex === firstIndex);

            const secondChromosome = candidates[secondIndex];
            const chromosome = crossoverFunction.call(null, firstChromosome, secondChromosome);

            newPopulation.push(chromosome);
        } while (newPopulation.length !== destinationSize);

        return newPopulation;
    }
}

module.exports = Matings;