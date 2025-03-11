const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, "hydeptrai", (error, user) => {
                if (error) {
                    return res.status(403).json({ status: false, message: "Token hết hạn" });
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json({ status: false, message: "Chưa xác thực Token" });
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
                return res.status(403).json({
                    status: false,
                    message: "Bạn không thể xóa nếu không được phân quyền của mình hoặc từ Admin"
                });
            }
        });
    }
};

module.exports = middlewareController;
