const { Contact } = require('../../models/contact');
const { User } = require('../../models/user');

async function sendContact(req, res, next) {
    try {
        const { sender, title, content } = req.body;

        const isExist = await User.findOne({ 'email': sender });
        if(!isExist) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const contact = new Contact({
            sender: sender,
            title: title,
            content: content
        });

        await contact.save();

        res.status(200).json({ contact });
        
    } catch (err) {
        next(err);
    }
};

module.exports = {
    sendContact
};