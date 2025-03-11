var express = require('express');
var router = express.Router();
var userController = require('../mongo/controller/user.controller')
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');

/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const userNew = await userController.resign(body)
    return res.status(200).json({status:true, userNew, mess:'thêm thành công',})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
});

router.post('/login', async (req, res) => {
  try {
      const body = req.body;
      const result = await userController.login(body,res);
      return res.status(200).json(result);
  } catch (error) {
      return res.status(401).json({
          status: false,
          message: 'Đăng nhập thất bại! Kiểm tra lại thông tin đăng nhập',
          error: error.message,
      });
  }
});

router.delete('/:id', middlewareController.verifyTokenAndAdmin, async (req,res,next) => {
  try {
    const {id} = req.params
    const result = await userController.deleteUser(id)
    return res.status(200).json({status:true, result, mess: 'Xóa thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.get('/', async (req,res,next) => {
  try {
    const result = await userController.getUser()
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.post('/refresh', async (req,res,next) => {
  try {
    const result = await userController.requestRefreshToken(req,res)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.post('/logout', async (req,res,next) => {
  try {
    const result = await userController.logoutUser(req,res)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.get('/:id', middlewareController.verifyToken,async (req,res,next) => {
  try {
    const {id} = req.params
    const result = await userController.getIdUser(id)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
});

module.exports = router;
