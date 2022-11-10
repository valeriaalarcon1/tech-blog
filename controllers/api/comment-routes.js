const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// GET all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.json(commentData);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

// CREATE a comment
router.post('/', async (req, res) => {
    try {
        if (req.session) {
            const commentData = await Comment.create({
              comment_text: req.body.comment_text,
              post_id: req.body.post_id,
              user_id: req.session.user_id,
            });
        }
        res.json(commentData);
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
    };
});

// DELETE a comment
router.delete('/:id', async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
              id: req.params.id
            }
          });
        
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(commentData);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;