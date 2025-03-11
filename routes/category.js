var express = require('express');
var router = express.Router();
const categoryController = require('../mongo/controller/category.controller')
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');


/* GET home page. */
router.get('/', async (req,res,next) => {
  try {
    const result = await categoryController.getAllCategory();
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.get('/:id', async (req,res) => {
  try {
    const {id} = req.params;
    const result = await categoryController.getIdCategory(id);
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.delete('/:id', async (req,res) => {
  try {
    const {id} = req.params
    const result = await categoryController.deleteCategory(id)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})


router.post('/', async (req,res) => {
  try {
    const body = req.body
    const cateNew = await categoryController.insert(body)
    return res.status(200).json(cateNew)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.put('/:id', async (req,res,next) => {
  try {
    const {id} = req.params
    const body = req.body
    const cateUpdate = await categoryController.updateCate(id, body)
    return res.status(200).json({status:true, cateUpdate, mess: 'Cập nhật thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

module.exports = router;
