const { Post } = require('../../../models/community');

async function topPosts(req, res, next) {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const totalPostCount = await Post.countDocuments({registeredAt: { $gte: threeDaysAgo }});
	
	let posts;
        if (totalPostCount <= 3) {
            posts = await Post.find().sort({ views: -1 }).limit(3).exec();
        } if (posts.length === 0) {
            posts = null;
        } else {
            posts = await Post.find({ 'registeredAt': {$gte: threeDaysAgo} })
            .sort({ views: -1, _id: 1  })
            .limit(3);
        }

	res.status(200).json({ posts: posts });
    }
    catch(err) {
        next(err);
    }
    
};

module.exports = {
    topPosts
};
