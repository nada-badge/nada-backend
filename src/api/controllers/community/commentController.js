const { Post, Comment } = require('../../../models/community');
const { User } = require('../../../models/user');

async function addComment(req, res, next) {
    try {
        const { userEmail, userName, content } = req.body;
        const post_id = req.params.post_id;
        
        const isExist = await User.findOne({ 'email': userEmail, 'profile.userName': userName });

        if(isExist == null) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        }

        let post = await Post.findById(post_id);

        if(post == null) {
            return res.status(401).json({ message: '해당 게시물을 찾을 수 없습니다.' });
        }

        const comment = new Comment({
            userEmail: userEmail,
            userName: userName,
            content: content
        });

        post.comments.push(comment);

        await post.save();

        res.status(200).json({ message: '댓글 등록 성공' });
    }
    catch (err) {
        next(err);
    }
};

async function updateComment(req, res, next) {
    try {
        const comment_id = req.body.comment_id;
        const post_id = req.params.post_id;

        if(post_id == null) {
            return res.status(400).json({ message: 'post_id 값이 null입니다.' });
        }
        if(comment_id == null) {
            return res.status(400).json({ message: 'comment_id 값이 null입니다.' });
        }

        let postToUpdate = await Post.findById(post_id);

        if(!postToUpdate || postToUpdate.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        let commentToUpdate = postToUpdate.comments.find(comment => comment._id == comment_id);
        
        if (!commentToUpdate || commentToUpdate.length == 0) {
            return res.status(404).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        commentToUpdate.content = req.body.content;
        commentToUpdate.isEdited = true;
        commentToUpdate.updatedAt = new Date();
 
        await postToUpdate.save();

        res.status(200).json({ commentToUpdate });
    }
    catch (err) {
        next(err);
    }
};

async function deleteComment(req, res, next) {
    try {
        const comment_id = req.body.comment_id;
        const post_id = req.params.post_id;

        if(post_id == null) {
            return res.status(400).json({ message: 'post_id 값이 null입니다.' });
        }
        if(comment_id == null) {
            return res.status(400).json({ message: 'comment_id 값이 null입니다.' });
        }

        let postToUpdate = await Post.findById(post_id);

        if(!postToUpdate || postToUpdate.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        let commentToDelete = postToUpdate.comments.find(comment => comment._id == comment_id);
        
        if (!commentToDelete || commentToDelete.length == 0) {
            return res.status(404).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        postToUpdate.comments = postToUpdate.comments.filter(comment => comment._id != comment_id);

        await postToUpdate.save();
  
        res.status(200).json({ commentToDelete });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    addComment,
    /*
    getComment,
    */
    updateComment,
    deleteComment
};