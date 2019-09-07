/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

class Utilities {
    static randomWord(length, characterSet) {
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(characterSet[Math.round(Math.random() * (characterSet.length - 1))]);
        }

        return result.join('');
    };

    static randomIndex(array) {
        return Math.round(Math.random() * (array.length - 1));
    }
}

module.exports = Utilities;