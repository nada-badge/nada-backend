const { Post } = require('../../../models/community');

async function topPosts(req, res, next) {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const totalPostCount = await Post.countDocuments({registeredAt: { $gte: threeDaysAgo }});
	
	let posts;
        if (totalPostCount <= 5) {
            posts = await Post.find().sort({ views: -1 }).exec();

<<<<<<< HEAD
        } if (posts.length === 0) {
            posts = null;
        } else {
            posts = await Post.find({ 'registeredAt': {$gte: threeDaysAgo} })
            .sort({ views: -1, _id: 1  })
            .limit(5);
        }

	res.status(200).json({ posts: posts });
=======
        } else {
            posts = await Post.find({ 'registeredAt': {$gte: threeDaysAgo} })
            .sort({ views: -1 })
            .limit(5);
        }
	res.status(200).json({posts});
>>>>>>> 01a508b92fbcc38665113107ef144e79ad409e4e
    }
    catch(err) {
        next(err);
    }
    
};

module.exports = {
    topPosts
};
