async function uploadImage(req, res, next) {
    try {
        return res.json(req.files);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    uploadImage
}