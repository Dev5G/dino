import FilterUtils from "./FilterUtils"

export const FilterEntitesWithCount = (entities, queryParams) => {
    const filter = new FilterUtils()
    const filteredEntities = filter.baseFilter(entities, queryParams)

    return Promise.resolve( filteredEntities)
}