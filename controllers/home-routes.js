const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');

// GET all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: { model: User, attributes: ['username'] }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        
        const posts = postData.map((post) =>
            post.get({ plain: true })
        );
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
            console.log(err);
            res.status(500).json(err);
    }
});

// GET one single post by id
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        };
        const posts = postData.map((post) =>
            post.get({ plain: true })
        );
        res.render('one-post', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
            console.log(err);
            res.status(500).json(err);
    }
});


// login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
  });
  

  // sign up route
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});


module.exports = router;