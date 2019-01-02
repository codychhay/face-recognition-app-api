const handleProfileGet = (req, res, database) => {
    const { id } = req.params;
    database('users')
        .select('*')
        .where({
            id: id
        })
        .then(userArray => {
            if (userArray.length) {
                res.json(userArray[0]);
            } else {
                res.status(400).json('User not found');
            }
        })
        .catch(err => res.status(400).json('Error retrieving user'));
}

module.exports = {
    handleProfileGet
}
