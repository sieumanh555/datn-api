const categoryModel = require('../model/category/category.model')
const { Error } = require('mongoose')

module.exports = {deleteCategory, getAllCategory, getIdCategory, insert, updateCate}

async function deleteCategory(id) {
    try {
        const proDel = await categoryModel.findByIdAndDelete(id)
        if(!proDel){
            throw new Error('Không tìm thấy sản phẩm')
        }
        return proDel
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function updateCate(id, body) {
    try {
        const pro = await categoryModel.findById(id)
        if(!pro){
            throw new Error('Đếch thấy sản phẩm')
        }
        const {name, status} = body
        const result = await categoryModel.findByIdAndUpdate(id,
            {name, status},
            {new: true}
        )
        return result
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function insert(body) {
    try {
        const {name, status} = body;
        const randomCode = Math.floor(100 + Math.random() * 900).toString() + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));

        const cateNew = new categoryModel({
            sku_id: randomCode,
            name,
            status
        })
        const result = await cateNew.save() 
        return result
    } catch (error) {
        console.log(error);
        throw error
    }
}
async function getAllCategory() {
    try {
        const result = await categoryModel.find().limit(10)
        return result
    } catch (error) {
        console.log(error);
        throw error   
    }
}

async function getIdCategory(id) {
    try {
        const result = await categoryModel.findById(id)
        return result
    } catch (error) {
        console.log(error);
        throw error   
    }
}