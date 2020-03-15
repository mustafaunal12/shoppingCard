let database = {};

const generateId = () => (Math.random() * 16 | 0).toString(16);

/**
 * Returns SaveFunction
 * @param {string} collection - Collection name
 * @returns {SaveFunction} - Save Function
 */
const save = collection =>
    /**
     * Saves the entity to database
     * @callback SaveFunction
     * @param {object}- entity
     * @returns {Promise<object>} - Contains the created object
     */
    async entity => {
        if (!database[collection]) {
            database[collection] = [];
        };

        entity.id = generateId();

        database[collection].push(entity);

        return entity;
    };

/**
 * Returns RemoveFunction
 * @param {string} collection - Collection name
 * @returns {RemoveFunction} - Remove Function
 */
const remove = collection =>
    /**
     * Removes the entity from database
     * @callback RemoveFunction
     * @param {object} - entity
     * @returns {Promise<boolean>} Returns true if the entity removed successfully from database
     */
    async entity => {
        if (!database[collection]) {
            return false;
        }

        const initialLength = database[collection].length;

        database[collection] = database[collection].filter(d => d.id !== entity.id);

        return initialLength > database[collection].length;
    };

const isMatchingObject = function (obj, query) {
    for (const key in query) {
        const element = query[key];
        if (obj[key] != element) {
            return undefined;
        }
    }
    return true;
};

/**
 * Returns FetchFunction
 * @param {string} collection - Collection name
 * @returns {FetchFunction} - Fetch Function
 */
const fetch = collection =>
    /**
     * Finds the object by given query
     * @callback FetchFunction - Fetch Function
     * @param {object} query - 
     * @returns {Promise<object>} - Returns matched objects by given query
     */
    async query => {
        if (!database[collection]) {
            return null;
        }

        const fetchedData = database[collection].reduce((pre, cur) => {
            if (isMatchingObject(cur, query)) {
                pre.push(cur);
            }
            return pre;
        }, []);

        if (fetchedData.length === 0) {
            return null;
        }
        
        return fetchedData;
    }

module.exports = collection => ({
    save: save(collection),
    remove: remove(collection),
    fetch: fetch(collection)
});