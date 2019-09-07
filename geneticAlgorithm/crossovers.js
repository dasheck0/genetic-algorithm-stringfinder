/**
 * Created by Stefan Neidig on 07.09.2019
 * Copyright © 2019 Stefan Neidig. All rights reserved.
 */

class Crossovers {
    static singlePointMiddle(firstChromosome, secondChromosome) {
        const crossoverIndex = Math.trunc(firstChromosome.length / 2);
        return firstChromosome.split('').map((gene, index) => {
            return index >= crossoverIndex ? secondChromosome[index] : gene;
        }).join('');
    }
}

module.exports = Crossovers;