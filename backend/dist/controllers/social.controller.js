import { User } from "../models/User";
import { Post } from "../models/Post";
export class SocialController {
    // Get user's social profile
    async getUserProfile(req, res) {
        try {
            const { address } = req.params;
            if (!address) {
                return res.status(400).json({
                    success: false,
                    error: "Address is required",
                });
            }
            // Get from database
            const user = await User.findOne({ address: address.toLowerCase() });
            // Get posts count
            const postsCount = await Post.countDocuments({
                author: address.toLowerCase(),
            });
            const profile = {
                address: address.toLowerCase(),
                username: user?.username || null,
                email: user?.email || null,
                profileImage: user?.profileImage || null,
                socialScore: user?.socialScore || 0,
                totalPosts: postsCount,
                followers: user?.followers || 0,
                lastActive: user?.lastActive || null,
                createdAt: user?.createdAt || null,
            };
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            console.error("Error getting user profile:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch user profile",
            });
        }
    }
    // Update user profile
    async updateUserProfile(req, res) {
        try {
            const { address } = req.params;
            const { username, email, profileImage, bio } = req.body;
            const updatedUser = await User.findOneAndUpdate({ address: address.toLowerCase() }, {
                username,
                email,
                profileImage,
                bio,
                lastActive: new Date(),
            }, { upsert: true, new: true });
            res.json({
                success: true,
                data: updatedUser,
            });
        }
        catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({
                success: false,
                error: "Failed to update profile",
            });
        }
    }
    // Get user's posts
    async getUserPosts(req, res) {
        try {
            const { address } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const posts = await Post.find({
                author: address.toLowerCase(),
            })
                .sort({ timestamp: -1 })
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
                .populate("comments.author", "username profileImage");
            const total = await Post.countDocuments({
                author: address.toLowerCase(),
            });
            res.json({
                success: true,
                data: {
                    posts,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit)),
                    },
                },
            });
        }
        catch (error) {
            console.error("Error getting user posts:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch posts",
            });
        }
    }
    // Get all posts (feed)
    async getAllPosts(req, res) {
        try {
            const { page = 1, limit = 20, sortBy = "timestamp" } = req.query;
            const sortOptions = {};
            if (sortBy === "likes") {
                sortOptions.likes = -1;
            }
            else {
                sortOptions.timestamp = -1;
            }
            const posts = await Post.find()
                .sort(sortOptions)
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
                .populate("author", "username profileImage")
                .populate("comments.author", "username profileImage");
            const total = await Post.countDocuments();
            // Enhance posts with author info from User collection
            const enhancedPosts = await Promise.all(posts.map(async (post) => {
                const author = await User.findOne({ address: post.author });
                return {
                    ...post.toObject(),
                    authorInfo: {
                        address: post.author,
                        username: author?.username || null,
                        profileImage: author?.profileImage || null,
                        socialScore: author?.socialScore || 0,
                    },
                };
            }));
            res.json({
                success: true,
                data: {
                    posts: enhancedPosts,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit)),
                    },
                },
            });
        }
        catch (error) {
            console.error("Error getting posts:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch posts",
            });
        }
    }
    // Get single post
    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const post = await Post.findOne({ postId: Number(postId) }).populate("comments.author", "username profileImage");
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: "Post not found",
                });
            }
            // Get author info
            const author = await User.findOne({ address: post.author });
            const enhancedPost = {
                ...post.toObject(),
                authorInfo: {
                    address: post.author,
                    username: author?.username || null,
                    profileImage: author?.profileImage || null,
                    socialScore: author?.socialScore || 0,
                },
            };
            res.json({
                success: true,
                data: enhancedPost,
            });
        }
        catch (error) {
            console.error("Error getting post:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch post",
            });
        }
    }
    // Add comment to post (off-chain)
    async addComment(req, res) {
        try {
            const { postId } = req.params;
            const { author, content } = req.body;
            if (!author || !content) {
                return res.status(400).json({
                    success: false,
                    error: "Author and content are required",
                });
            }
            const post = await Post.findOne({ postId: Number(postId) });
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: "Post not found",
                });
            }
            // Add comment
            post.comments.push({
                author: author.toLowerCase(),
                content,
                timestamp: new Date(),
            });
            await post.save();
            // Update commenter's social score
            await User.findOneAndUpdate({ address: author.toLowerCase() }, {
                $inc: { socialScore: 2 }, // 2 points for commenting
                lastActive: new Date(),
            }, { upsert: true });
            res.json({
                success: true,
                message: "Comment added successfully",
                data: post,
            });
        }
        catch (error) {
            console.error("Error adding comment:", error);
            res.status(500).json({
                success: false,
                error: "Failed to add comment",
            });
        }
    }
    // Get social leaderboard
    async getSocialLeaderboard(req, res) {
        try {
            const { limit = 10, period = "all" } = req.query;
            let matchCondition = {};
            if (period === "week") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                matchCondition = { lastActive: { $gte: oneWeekAgo } };
            }
            else if (period === "month") {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                matchCondition = { lastActive: { $gte: oneMonthAgo } };
            }
            const leaderboard = await User.aggregate([
                { $match: matchCondition },
                {
                    $lookup: {
                        from: "posts",
                        localField: "address",
                        foreignField: "author",
                        as: "posts",
                    },
                },
                {
                    $addFields: {
                        totalPosts: { $size: "$posts" },
                        totalLikes: { $sum: "$posts.likes" },
                    },
                },
                {
                    $project: {
                        address: 1,
                        username: 1,
                        profileImage: 1,
                        socialScore: 1,
                        totalPosts: 1,
                        totalLikes: 1,
                        lastActive: 1,
                    },
                },
                { $sort: { socialScore: -1 } },
                { $limit: Number(limit) },
            ]);
            res.json({
                success: true,
                data: leaderboard,
            });
        }
        catch (error) {
            console.error("Error getting leaderboard:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch leaderboard",
            });
        }
    }
    // Get trending posts
    async getTrendingPosts(req, res) {
        try {
            const { limit = 10, timeframe = "24h" } = req.query;
            let timeFilter = new Date();
            if (timeframe === "24h") {
                timeFilter.setHours(timeFilter.getHours() - 24);
            }
            else if (timeframe === "7d") {
                timeFilter.setDate(timeFilter.getDate() - 7);
            }
            else if (timeframe === "30d") {
                timeFilter.setDate(timeFilter.getDate() - 30);
            }
            const trendingPosts = await Post.aggregate([
                {
                    $match: {
                        timestamp: { $gte: timeFilter },
                    },
                },
                {
                    $addFields: {
                        trendingScore: {
                            $add: [
                                { $multiply: ["$likes", 3] }, // Weight likes more
                                { $size: "$comments" }, // Comments count
                            ],
                        },
                    },
                },
                { $sort: { trendingScore: -1, timestamp: -1 } },
                { $limit: Number(limit) },
            ]);
            // Enhance with author info
            const enhancedPosts = await Promise.all(trendingPosts.map(async (post) => {
                const author = await User.findOne({ address: post.author });
                return {
                    ...post,
                    authorInfo: {
                        address: post.author,
                        username: author?.username || null,
                        profileImage: author?.profileImage || null,
                        socialScore: author?.socialScore || 0,
                    },
                };
            }));
            res.json({
                success: true,
                data: enhancedPosts,
            });
        }
        catch (error) {
            console.error("Error getting trending posts:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch trending posts",
            });
        }
    }
    // Search posts and users
    async search(req, res) {
        try {
            const { query, type = "all", page = 1, limit = 20 } = req.query;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    error: "Search query is required",
                });
            }
            const searchRegex = new RegExp(query, "i");
            let results = {};
            if (type === "all" || type === "posts") {
                const posts = await Post.find({
                    $or: [{ content: searchRegex }, { asset: searchRegex }],
                })
                    .sort({ timestamp: -1 })
                    .limit(Number(limit))
                    .skip((Number(page) - 1) * Number(limit));
                results.posts = posts;
            }
            if (type === "all" || type === "users") {
                const users = await User.find({
                    $or: [{ username: searchRegex }, { address: searchRegex }],
                })
                    .select("address username profileImage socialScore")
                    .limit(Number(limit))
                    .skip((Number(page) - 1) * Number(limit));
                results.users = users;
            }
            res.json({
                success: true,
                data: results,
            });
        }
        catch (error) {
            console.error("Error searching:", error);
            res.status(500).json({
                success: false,
                error: "Search failed",
            });
        }
    }
    // Get social analytics for user
    async getUserAnalytics(req, res) {
        try {
            const { address } = req.params;
            const { period = "30d" } = req.query;
            let dateFilter = new Date();
            if (period === "7d") {
                dateFilter.setDate(dateFilter.getDate() - 7);
            }
            else if (period === "30d") {
                dateFilter.setDate(dateFilter.getDate() - 30);
            }
            else if (period === "90d") {
                dateFilter.setDate(dateFilter.getDate() - 90);
            }
            const analytics = await Post.aggregate([
                {
                    $match: {
                        author: address.toLowerCase(),
                        timestamp: { $gte: dateFilter },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalPosts: { $sum: 1 },
                        totalLikes: { $sum: "$likes" },
                        totalComments: { $sum: { $size: "$comments" } },
                        avgLikesPerPost: { $avg: "$likes" },
                        avgCommentsPerPost: { $avg: { $size: "$comments" } },
                    },
                },
            ]);
            const result = analytics[0] || {
                totalPosts: 0,
                totalLikes: 0,
                totalComments: 0,
                avgLikesPerPost: 0,
                avgCommentsPerPost: 0,
            };
            // Get user's current social score
            const user = await User.findOne({ address: address.toLowerCase() });
            result.socialScore = user?.socialScore || 0;
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            console.error("Error getting analytics:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch analytics",
            });
        }
    }
}
export const socialController = new SocialController();
//# sourceMappingURL=social.controller.js.map