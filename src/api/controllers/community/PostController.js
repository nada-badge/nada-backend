const { Post } = require('../../../models/community');
const { User } = require('../../../models/user');
const COMMUNITY = require('../../../common/const/community');

async function addPost(req, res, next) {
    try {
        const { userEmail, userName, category, field, area, title, content } = req.body;
        
        const isExist = await User.findOne({ 'email': userEmail, 'profile.userName': userName });

        if(isExist == null) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        } 

        if(!COMMUNITY.category.includes(category)) {
            return res.status(401).json({ message: '카테고리 설정이 잘못되었습니다.' });
        }

        if(!COMMUNITY.field.includes(field) || (field.includes("전체") && COMMUNITY.field.includes(field))) {
            return res.status(401).json({ message: '유효하지 않은 분야입니다.' });
        }

        if(!COMMUNITY.area.includes(area) || (area.includes("전국") && COMMUNITY.area.includes(area))) {
            return res.status(401).json({ message: '장소 설정이 잘못되었습니다.' });
        }

        /* ----------------------------------
            모집, 홍보 시 각 분류 설정 검증
        ----------------------------------- */

        const post = new Post({
            userEmail: userEmail,
            userName: userName,
            category: category,
            field: field,
            area: area,
            title: title,
            content: content
        });

        await post.save();

        res.status(200).json({ message: '게시물 등록 성공' });
    }
    catch (err) {
        next(err);
    }
};

async function updatePost(req, res, next) {
    try {
        const toUpdate = req.body;
        const id = toUpdate._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let post = await Post.findById(id);
    
        if(!post || post.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }
        
        toUpdate.updatedAt = new Date();

        Object.assign(post, toUpdate);

        await post.save();
        
        res.status(200).json({ post });
    }
    catch (err) {
        next(err);
    }
};

async function deletePost(req, res, next) {
    try {
        const toDelete = req.body;
        const id = toDelete._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let post = await Post.findById(id);
    
        if(!post || post.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        await post.deleteOne();
        
        res.status(200).json({ post });
    }
    catch (err) {
        next(err);
    }
};


module.exports = {
    addPost,
    /*  
    getPost,
    listPost,
    */
    updatePost,
    deletePost
};