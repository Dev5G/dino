export const storeActionTypes = {
    storeFetched: "[store] fetched Action"
};


export const storeAction = (_payload) => {
    return {
        type: storeActionTypes.storeFetched,
        payload: _payload
    }
}