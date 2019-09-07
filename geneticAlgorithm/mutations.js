/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

const utilities = require('../utilities');

class Mutations {
    static singleCharacter(chromosome, mutationChance, characterSet) {
        const alreadyMutated = false;

        return chromosome.split('').map((gene) => {
            if (alreadyMutated || Math.random() > mutationChance) {
                return gene;
            }

            return characterSet[utilities.randomIndex(characterSet)];
        }).join('');
    }
}

module.exports = Mutations;