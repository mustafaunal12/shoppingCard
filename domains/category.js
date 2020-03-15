/**
 * Returns new category object
 * @param {string} name - Category name
 * @param {string} parent - Parent category
 * @returns {Category} - Category object
 */
function Category(name, parent) {
    return {
        name,
        parent
    };
};

module.exports = Category;