const handleSignin = (database, bcrypt) => (req, res) => {
    const { email, password }  = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect sign in info');
    }
    database('login').select('*')
        .where({
            email: email
        })
        .then(loginInfo => {
            const isValid = bcrypt.compareSync(password, loginInfo[0].hash);
            if (isValid){
                database('users')
                    .select('*')
                    .where('email', '=', email)
                    .then(userArray => {
                        res.json(userArray[0]);
                    })
                    .catch(err => res.json('Unable to get user'));
            } else {
                res.status(400).json('Wrong signin info');  //
            }
        })
        .catch(err => res.status(400).json('Wrong signin info')); // Error is caught when wrong email, db can't find email.
}

module.exports = {
    handleSignin: handleSignin
}