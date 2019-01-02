const handleImage = (req, res, database) => {
    const { id } = req.body;
    database('users')
        .where({id: id})
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.json('unable to update entries'));
}

module.exports = {
    handleImage
}