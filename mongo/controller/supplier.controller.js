const supplierModel = require('../model/supplier/supplier.model'); // Assuming you'll rename the model file if needed
const { Error } = require('mongoose');

module.exports = { deleteSupplier, getAllSuppliers, getSupplierById, insertSupplier, updateSupplier };

async function deleteSupplier(id) {
    try {
        const supplierDel = await supplierModel.findByIdAndDelete(id);
        if (!supplierDel) {
            throw new Error('Không tìm thấy nhà cung cấp');
        }
        return supplierDel;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateSupplier(id, body) {
    try {
        const supplier = await supplierModel.findById(id);
        if (!supplier) {
            throw new Error('Không tìm thấy nhà cung cấp');
        }

        const { name, diachi, numberphone, email, contactName, taxCode, type } = body;

        const result = await supplierModel.findByIdAndUpdate(
            id,
            { name, diachi, numberphone, email, contactName, taxCode, type },
            { new: true }
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertSupplier(body) {
    try {
        const { name, diachi, numberphone, email, contactName, taxCode, type } = body;

        const supplierNew = new supplierModel({
            name,
            diachi,
            numberphone,
            email,
            contactName,
            taxCode,
            type,
        });

        const result = await supplierNew.save();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getAllSuppliers() {
    try {
        const result = await supplierModel.find().limit(10);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getSupplierById(id) {
    try {
        const result = await supplierModel.findById(id);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}