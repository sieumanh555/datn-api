const { Voucher, Disvoucher } = require('../model/voucher/voucher.model');
const { Error } = require('mongoose');

module.exports = { deleteVoucher, getAllVouchers, getVoucherById, insertVoucher, updateVoucher, insertLimitVoucher, updateLimitVoucher, getAllLimitVouchers };

async function deleteVoucher(id) {
    try {
        const voucherDel = await Voucher.findByIdAndDelete(id);
        if (!voucherDel) {
            throw new Error('Không tìm thấy voucher');
        }
        return voucherDel;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertVoucher(body) {
    try {
        const { name, code, type, value, status } = body;
        const voucherNew = new Voucher({ name, code, type, value, status });
        const result = await voucherNew.save();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateVoucher(id, body) {
    try {
        const voucher = await Voucher.findById(id);
        if (!voucher) {
            throw new Error('Không tìm thấy voucher');
        }
        const result = await Voucher.findByIdAndUpdate(id, body, { new: true });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertLimitVoucher(body) {
    try {
        const { nameCre, discountLimit } = body;
        const limitVoucherNew = new Disvoucher({ nameCre, discountLimit });
        const result = await limitVoucherNew.save();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateLimitVoucher(id, body) {
    try {
        const limitVoucher = await Disvoucher.findById(id);
        if (!limitVoucher) {
            throw new Error('Không tìm thấy limit voucher');
        }
        const result = await Disvoucher.findByIdAndUpdate(id, body, { new: true });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getAllVouchers() {
    try {
        const result = await Voucher.find().limit(10);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
async function getAllLimitVouchers() {
    try {
        const result = await Disvoucher.find().limit(10);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
async function getVoucherById(id) {
    try {
        const result = await Voucher.findById(id);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}