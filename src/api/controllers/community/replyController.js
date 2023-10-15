const { Post, Reply } = require('../../../models/community');
const { User } = require('../../../models/user');

async function addReply(req, res, next) {
    try {
        const { userEmail, userName, content } = req.body;
        const post_id = req.params.post_id;
        const comment_id = req.params.comment_id;
        
        const isExist = await User.findOne({ 'email': userEmail, 'profile.userName': userName });

        if(isExist == null) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        }

        const post = await Post.findById(post_id);

        if(!post) {
            return res.status(401).json({ message: '해당 게시물을 찾을 수 없습니다.' });
        }

        const comment = post.comments.id(comment_id);

        if(!comment) {
            return res.status(401).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        const reply = new Reply({
            userEmail,
            userName,
            content,
        });

        comment.replies.push(reply);

        await post.save();

        res.status(200).json({ message: '답글 등록 성공' });
    }
    catch (err) {
        next(err);
    }
};

async function updateReply(req, res, next) {
    try {
        const reply_id = req.body.reply_id;
        const post_id = req.params.post_id;
        const comment_id = req.params.comment_id;

        if(!post_id) {
            return res.status(400).json({ message: 'post_id 값이 null입니다.' });
        }
        if(!comment_id) {
            return res.status(400).json({ message: 'comment_id 값이 null입니다.' });
        }
        if(!reply_id) {
            return res.status(400).json({ message: 'reply_id 값이 null입니다.' });
        }

        let postToUpdate = await Post.findById(post_id);

        if(!postToUpdate || postToUpdate.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        let commentToUpdate = postToUpdate.comments.id(comment_id);

        if (!commentToUpdate || commentToUpdate.length == 0) {
            return res.status(404).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        let replyToUpdate = commentToUpdate.replies.id(reply_id);

        if (!replyToUpdate || replyToUpdate.length == 0) {
            return res.status(404).json({ message: '해당 답글을 찾을 수 없습니다.' });
        }

        replyToUpdate.content = req.body.content;
        replyToUpdate.isEdited = true;
        replyToUpdate.updatedAt = new Date();
 
        await postToUpdate.save();

        res.status(200).json({ replyToUpdate });
    }
    catch (err) {
        next(err);
    }
};

async function deleteReply(req, res, next) {
    try {
        const reply_id = req.body.reply_id;
        const post_id = req.params.post_id;
        const comment_id = req.params.comment_id;

        if(post_id == null) {
            return res.status(400).json({ message: 'post_id 값이 null입니다.' });
        }
        if(!comment_id) {
            return res.status(400).json({ message: 'comment_id 값이 null입니다.' });
        }
        if(!reply_id) {
            return res.status(400).json({ message: 'reply_id 값이 null입니다.' });
        }

        let postToUpdate = await Post.findById(post_id);

        if(!postToUpdate || postToUpdate.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        let commentToUpdate = postToUpdate.comments.id(comment_id);

        if (!commentToUpdate || commentToUpdate.length == 0) {
            return res.status(404).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        let replyToDelete = commentToUpdate.replies.id(reply_id);

        if (!replyToDelete || replyToDelete.length == 0) {
            return res.status(404).json({ message: '해당 답글을 찾을 수 없습니다.' });
        }

        commentToUpdate.replies = commentToUpdate.replies.filter(reply => reply._id.toString() !== reply_id);

        await postToUpdate.save();
  
        res.status(200).json({ replyToDelete });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    addReply,
    /*
    getReply,
    */
    updateReply,
    deleteReply
};