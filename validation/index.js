/**
 * Created by appcom interactive GmbH on 07.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

module.exports = {
    validateProfile: (profile) => {
        return profile.generations && profile.generations.max &&
            profile.population && profile.population.size && profile.population.limit &&
            profile.fitness && profile.fitness.algorithm &&
            profile.mating && profile.mating.algorithm &&
            profile.crossover && profile.crossover.algorithm &&
            profile.mutation && profile.mutation.algorithm && profile.mutation.chance;
    }
};