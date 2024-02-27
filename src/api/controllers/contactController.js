const { Contact } = require('../../models/contact');
const { User } = require('../../models/user');

async function sendContact(req, res, next) {
    try {
        const { sender, title, content, imageUrl } = req.body;

        const isExist = await User.findOne({ 'email': sender });
        if(!isExist) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const contact = new Contact({
            sender: sender,
            title: title,
            content: content,
            imageUrl: imageUrl
        });

        await contact.save();

        res.status(200).json({ contact });
        
    } catch (err) {
        next(err);
    }
};

async function listContact(req, res, next) {
    try {
        const contacts = await Contact.find({});

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: '문의가 존재하지 않습니다.' });
        }

        res.status(200).json({ contacts });
        
    } catch (err) {
        next(err);
    }
};

async function getContact(req, res, next) {
    try {
        const { contact_id } = req.params;

        const contact = await Contact.findByIdAndUpdate(
            contact_id,
            { isRead: true },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: '해당 문의가 존재하지 않습니다.' });
        }

        res.status(200).json({ contact });
        
    } catch (err) {
        next(err);
    }
};

module.exports = {
    sendContact,
    listContact,
    getContact
};