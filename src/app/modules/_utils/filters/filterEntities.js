import { searchInArray } from './searchInArray'


export const FilterEntites = (entities, queryParams, isProduct = false) => new Promise((resolve, reject) => {
    if (entities === null || entities === undefined) {
        return;
    }
    let filteredEntities = [...entities]
    let searchDone = false
    const filter = queryParams.filter
    let weightSum = 0

    Object.keys(filter).forEach(key => {
        searchDone = true
        const searchParam = { [key]: filter[key] }
        filteredEntities = searchInArray(filteredEntities, searchParam)
    })

    if (!searchDone) {
        return entities;
    }
    if (isProduct) {

        const weightFilter = queryParams.weightFilter

        if (weightFilter !== {} && weightFilter !== undefined) {
            if (weightFilter.min !== undefined) {
                filteredEntities = filteredEntities.filter(x => {
                    return x.weight >= weightFilter.min
                })
            }
            if (weightFilter.max !== undefined) {
                filteredEntities = filteredEntities.filter(x => {
                    return x.weight <= weightFilter.max
                })
            }
        }
        const totalWeight = () => filteredEntities.reduce((acc, curr) => acc + curr.weight, 0)
        weightSum = totalWeight()
    }
    const pageNumber = queryParams.pageNumber - 1;
    const totalCount = filteredEntities.length;
    const initialPos = pageNumber * queryParams.pageSize;
    filteredEntities = filteredEntities.slice(
        initialPos,
        initialPos + queryParams.pageSize
    );
    const queryResults = {
        entities: filteredEntities,
        totalCount: totalCount,
        totalWeight: weightSum,
        errorMessage: ""
    };

    return resolve(queryResults)
})

