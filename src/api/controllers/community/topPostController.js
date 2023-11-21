const { Post } = require('../../../models/community');

async function topPosts(req, res, next) {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const totalPostCount = await Post.countDocuments({registeredAt: { $gte: threeDaysAgo }});
	
	let posts;
        if (totalPostCount <= 5) {
            posts = await Post.find().sort({ views: -1 }).exec();

        } else {
            posts = await Post.find({ 'registeredAt': {$gte: threeDaysAgo} })
            .sort({ views: -1 })
            .limit(5);
        }
	res.status(200).json({posts});
    }
    catch(err) {
        next(err);
    }
    
};

module.exports = {
    topPosts
};
