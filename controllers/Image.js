const Clarifai =  require('clarifai');
const env = require('dotenv').config().parsed;

// Update entry count when user submit image
const handleImage = (req, res, database) => {
    const { id } = req.body;
    database('users')
        .where({id: id})
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.json('unable to update entries'));
}

// Handle API call to Clarifai face recognition model
const handleClarifaiApiCall = (req, res) => {
    const { inputUrl } = req.body;
    const app = new Clarifai.App({
        apiKey: env.ClarifaiApiKey
    });

    app.models.predict(Clarifai.FACE_DETECT_MODEL, inputUrl)
        .then(response => res.json(response))
        .catch(err => res.status(400).json('Error calling Clarifai Api.'))
};

module.exports = {
    handleImage,
    handleClarifaiApiCall
}