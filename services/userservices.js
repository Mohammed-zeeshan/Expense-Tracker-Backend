const getExpenses = (req, res, next) => {
    return req.user.getExpenses();
}

module.exports = {
    getExpenses,
}