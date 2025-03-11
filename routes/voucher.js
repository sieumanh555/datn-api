var express = require('express');
var router = express.Router();
const voucherController = require('../mongo/controller/voucher.controller'); // Updated import
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        const result = await voucherController.getAllVouchers(); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.get('/limitvc', async (req, res, next) => {
    try {
        const result = await voucherController.getAllLimitVouchers(); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await voucherController.getVoucherById(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await voucherController.deleteVoucher(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const voucherNew = await voucherController.insertVoucher(body); // Updated function call
        return res.status(200).json(voucherNew);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});
router.post('/limitvc', async (req, res) => {
    try {
        const body = req.body;
        const voucherNew = await voucherController.insertLimitVoucher(body); // Updated function call
        return res.status(200).json(voucherNew);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const voucherUpdate = await voucherController.updateVoucher(id, body); // Updated function call
        return res.status(200).json({ status: true, voucherUpdate, mess: 'Cập nhật thành công' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});
router.put('/limitvc/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const voucherUpdate = await voucherController.updateLimitVoucher(id, body); // Updated function call
        return res.status(200).json({ status: true, voucherUpdate, mess: 'Cập nhật thành công' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});
module.exports = router;