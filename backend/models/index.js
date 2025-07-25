const Post = require('../models/post');
const PostTranslation = require('../models/postTranslation');
const PostFile = require('../models/postFile');
const PostComment = require('../models/postComment');
const User = require('../models/user');
const HomeImg = require('../models/homeImg')

Post.hasMany(PostTranslation, { foreignKey: 'post_id', onDelete: 'CASCADE', as: 'translations' });
Post.hasMany(PostFile, { foreignKey: 'post_id', onDelete: 'CASCADE', as: 'files' });
Post.hasMany(PostComment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

PostComment.belongsTo(Post, { foreignKey: 'post_id' });
PostComment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

PostFile.belongsTo(Post, { foreignKey: 'post_id' });
PostFile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

PostTranslation.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' })
User.hasMany(PostFile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(PostComment, { foreignKey: 'user_id', onDelete: 'CASCADE' })
User.hasMany(HomeImg, { foreignKey: 'user_id', onDelete: 'CASCADE' })

HomeImg.belongsTo(User, {foreignKey: 'user_id'})

module.exports = {
    Post,
    PostTranslation,
    PostFile,
    PostComment,
    User,
    HomeImg
};