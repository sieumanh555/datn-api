var express = require('express');
var router = express.Router();
const supplierController = require('../mongo/controller/supplier.controller'); // Updated import
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        const result = await supplierController.getAllSuppliers(); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supplierController.getSupplierById(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supplierController.deleteSupplier(id); // Updated function call
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const supplierNew = await supplierController.insertSupplier(body); // Updated function call
        return res.status(200).json(supplierNew);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const supplierUpdate = await supplierController.updateSupplier(id, body); // Updated function call
        return res.status(200).json({ status: true, supplierUpdate, mess: 'Cập nhật thành công' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
    }
});

module.exports = router;