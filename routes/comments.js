var express = require('express');
var router = express.Router();
const commentController = require('../mongo/controller/comments.controller'); // Updated import
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        const result = await commentController.getAllComments(); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentController.getCommentById(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentController.deleteComment(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const commentNew = await commentController.insertComment(body); // Updated function call
        return res.status(200).json(commentNew);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;

        if (!id) {
            return res.status(400).json({ status: false, mess: 'ID bình luận không hợp lệ' });
        }
        if (!body) {
            return res.status(400).json({ status: false, mess: 'Dữ liệu cập nhật không hợp lệ' });
        }

        const commentUpdate = await commentController.updateComment(id, body);

        if (!commentUpdate) {
            return res.status(404).json({ status: false, mess: 'Không tìm thấy bình luận để cập nhật' });
        }

        return res.status(200).json({ status: true, commentUpdate, mess: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error); // Use console.error for errors
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

module.exports = router;