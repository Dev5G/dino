export const searchInArray =(_incomingArray, _queryObj) =>{
        const result = [];
        const indexes = [];
        let doSearch = false;

        Object.keys(_queryObj).forEach(key => {
            if (_queryObj[key]) {
                const searchText = _queryObj[key]
                    .toString()
                    .trim()
                    .toLowerCase();
                if (key && searchText) {
                    doSearch = true;
                    try {
                        _incomingArray.forEach((element, index) => {
                            if (element[key] || (element[key] === 0 && searchText === "0")) {
                                const _val = element[key]
                                    .toString()
                                    .trim()
                                    .toLowerCase();
                                if (
                                    _val.indexOf(searchText) > -1 &&
                                    indexes.indexOf(index) === -1
                                ) {
                                    indexes.push(index);
                                }
                            }
                        });
                    } catch (ex) {
                        console.log(ex, key, searchText);
                    }
                }
            }
        });

        if (!doSearch) {
            return _incomingArray;
        }

        indexes.forEach(re => {
            result.push(_incomingArray[re]);
        });

        return result;
    }