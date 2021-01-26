export const FilterMinMax = (_entitites: [], queryParams) => new Promise((resolve, reject) => {
    let filteredEntities = [..._entitites]
    const  weightFilter = queryParams.weightFilter
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
        errorMessage: ""
    };
    return resolve(queryResults)
})