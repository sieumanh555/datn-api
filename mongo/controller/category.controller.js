const categoryModel = require('../model/category/category.model')
const productModel = require('../model/products/product.model')
const { Error } = require('mongoose')

module.exports = {deleteCategory, getAllCategory, getIdCategory, insert, updateCate}

async function deleteCategory(id) {
    try {
      // Kiểm tra xem có sản phẩm nào có categoryId này không
      const products = await productModel.find({ 'category.categoryId': id });
  
      if (products.length > 0) {
       throw new Error('Không thể xóa danh mục này vì có sản phẩm đang sử dụng.');
      } 
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
        throw new Error('Không tìm thấy danh mục');
    }
    console.log('Danh mục đã được xóa thành công');
    return deletedCategory;
    } catch (error) {
      console.log(error);
      throw error;
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