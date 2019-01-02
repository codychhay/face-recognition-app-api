const handleRegister = (req, res, database, bcrypt) => {
    const {name, email, password} = req.body;
    const hash = calculatePasswordHash(password, bcrypt);
    database.transaction(trx => {
        trx('login').insert({
            email: email,
            hash: hash
        })
            .returning('*')
            .then(() => {
                return trx('users').insert({
                    name: name,
                    email: email,
                    joined: new Date()
                })
                    .returning('*')
                    .then(userArray =>  {
                        res.json(userArray[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register user'));
}

/*
    Helper functions section
 */

function calculatePasswordHash(password, bcrypt) {
    // Salt for calculating password hash
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}


module.exports = {
    handleRegister
}