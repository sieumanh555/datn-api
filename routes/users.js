var express = require("express");
var router = express.Router();
const userController = require("../mongo/controller/user.controller")
// const middleware = require("../mongo/middleware.controller");


// GET: url/users
router.get("/", async (req, res) => {
    try {
        const result = await userController.getUsers();
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({status: 500, message: "Lỗi server"});
    }
});
router.get("/getemployee", async (req, res) => {
    try {
        const result = await userController.getEmployee();
        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({status: 500, message: "Lỗi server"});
    }
});

// GET: url/users/:id
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const result = await userController.getUserById(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

// POST: url/users/register
router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const result = await userController.register(body);
        return res.status(result.status).json(result);
    } catch
        (error) {
        console.error(error);
        return res
            .status(500)
            .json("Lỗi server");
    }
});

// POST: url/users/login
router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        const result = await userController.login(body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({status: false, mess: "Đăng nhập thất bại"});
    }
});

// PUT: url/users/:id
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const token = req.headers.authorization;
        const body = req.body;

        const result = await userController.editUser(id, token, body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({status: 500, message: "Lỗi server"});
    }
});

// DELETE: url/users/:id
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const token = req.headers.authorization;
        const result = await userController.deleteUser(id, token);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({status: 500, mess: "Lỗi server"});
    }
});

// POST: url/users/refreshToken
router.post("/refreshToken", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const result = await userController.refreshToken(token);

        if (result.status === 200) {
            return res.status(200).json({
                access_token: result.access_token,
                refresh_token: result.refresh_token,
            });
        } else {
            return res.status(result.status).json({mess: result.mess});
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({status: false, mess: "Refresh token thất bại"});
    }
});

module.exports = router;
