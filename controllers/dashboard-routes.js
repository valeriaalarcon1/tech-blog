const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');

// GET all of user's posts
router.get('/', async (req, res) => {
    try {
        const userPostData = await Post.findAll({
            where: {
              user_id: req.session.user_id
            },
            include: [
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: {
                  model: User,
                  attributes: ['username']
                }
              },
              {
                model: User,
                attributes: ['username']
              }
            ]
        });
        
        const posts = userPostData.map((post) =>
            post.get({ plain: true })
        );
        res.render('dashboard', {
            posts,
            loggedIn: true
        });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});



router.get('/create/', async (req, res) => {
    try {
        const userPostData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'post_text'
            ],
            include: [
                {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
                },
                {
                model: User,
                attributes: ['username']
                }
            ]
        });
        const posts = userPostData.map((post) =>
            post.get({ plain: true }));
        res.render('create-post', { posts, loggedIn: true }
        );
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;