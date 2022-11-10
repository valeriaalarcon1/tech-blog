const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// GET all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
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
                },
            ]
        });
        res.json(postData)

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET one post by id
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'post_text'
            ],
            include: [
                {
                model: User,
                attributes: ['username']
                },
                {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
                }
            ]
        })
      
        if (!postData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(postData);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
  });

  // ADD post
router.post('/', async (req, res) => {
    try {
        const postData = await Post.create({
            title: req.body.title,
            post_text: req.body.post_text,
            user_id: req.session.user_id
        })
        res.json(postData);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});


router.delete('/:id', async (req, res) => {
try {
    const postData = await Post.destroy({
        where: {
            id: req.params.id
        }
    });
    
    if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    res.json(postData);
} catch(err) {
    console.log(err);
    res.status(500).json(err);
};
});

module.exports = router;