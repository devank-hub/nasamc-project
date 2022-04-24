const DEFAULT_PAGE_LIMIT = 1;
const DEFAULT_LIMIT= 0; // to load all launches from database

function getPagination(query) {
   const page = Math.abs(query.page) || (DEFAULT_PAGE_LIMIT);
   const limit = Math.abs(query.limit) || (DEFAULT_LIMIT);
    
    const skip = (page - 1) * limit;
    return {
        skip, limit
    }
}

export {
    getPagination
};