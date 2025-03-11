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
        const {name} = body
        const result = await categoryModel.findByIdAndUpdate(id,
            {name},
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
        const {name} = body;
        const cateNew = new categoryModel({
            name
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