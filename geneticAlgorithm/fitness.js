/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

class Fitness {
    static sumDifference(destinationWord, testWord) {
        return destinationWord.split('').map((char, index) => char === testWord[index] ? 0 : 1).reduce((a, b) => a + b, 0);
    };
}

module.exports = Fitness;