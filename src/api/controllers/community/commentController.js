const { Post, Comment } = require('../../../models/community');
const { User } = require('../../../models/user');

async function addComment(req, res, next) {
    try {
        const { userEmail, userName, content } = req.body;
        const post_id = req.params.post_id;

        console.log(post_id);
        
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

module.exports = {
    addComment /*,
    getComment,
    updateComment,
    deleteComment,
    */
};