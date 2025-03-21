const userModel = require("../model/user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
    getUsers,
    getUserById,
    register,
    login,
    editUser,
    deleteUser,
    getEmployee,
    refreshToken,
};

async function getUsers() {
    try {
        const users = await userModel.find({role: 0});
        return users;
    } catch (error) {
        console.log(error);
        return {status: 404, message: "Lỗi fetching users"};
    }
}


async function getEmployee() {
    try {
        const users = await userModel.find({role: 1});
        return users;
    } catch (error) {
        console.log(error);
        return {status: 404, message: "Lỗi fetching users"};
    }
}

async function getUserById(id) {
    try {
        const result = await userModel.findById(id);
        return {status: 200, data: result};
    } catch (error) {
        console.log(error);
        return {status: 404, message: "Không tìm thấy tài khoản"};
    }
}

async function register(body) {
    try {
        const {  
            firstname, 
            lastname, 
            phone, 
            password, 
            email, 
            address, 
            gender, 
            image,
            birthday,  
          } = body;

        let user = await userModel.findOne({email: email});

        if (user) {
            return {status: 409, message: "Email đã tồn tại"};
        }
        const getRandomChar = (charSet) => 
            charSet[Math.floor(Math.random() * charSet.length)];
          
          // Tạo mã với 2 chữ cái, 2 số, 2 ký tự đặc biệt
          const randomCode = 
            getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ") +
            getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ") +
            getRandomChar("0123456789") +
            getRandomChar("0123456789") +
            getRandomChar("!@#$%^&*") +
            getRandomChar("!@#$%^&*");
        // tạo hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user = new userModel({
            kyc_id: randomCode,       // Thêm kyc_id
            firstname,    // Thêm firstname
            lastname,     // Thêm lastname
            phone, 
            password: hash, 
            email, 
            image,
            address, 
            gender,       // Thêm gender
            birthday,     // Thêm birthday       // role có giá trị mặc định nhưng vẫn có thể truyền vào
          });
        await user.save();
        const access_token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            config.secret_key,
            {expiresIn: "3d"}
        );
        const refresh_token = jwt.sign(
            {
                user_id: user._id,
                role: user.role,
            },
            config.secret_key,
            {expiresIn: "15d"}
        );
        return {
            status: 200,
            message: "Đăng ký thành công",
            access_token: access_token,
            refresh_token: refresh_token,
            user: user,
        };
    } catch (error) {
        console.log(error.message);
        return {status: 500, message: "Đăng ký thất bại"};
    }
}

async function login(body) {
    try {
        const {email, password} = body;

        const user = await userModel.findOne({email: email});

        if (!user) {
            return {status: 401, message: "Email hoặc mật khẩu không đúng"};
        }

        const matchPass = bcrypt.compareSync(password, user.password);
        if (matchPass) {
            const access_token = jwt.sign(
                {
                    userInfo: user,
                },
                config.secret_key,
                {expiresIn: "3d"}
            );

            const refresh_token = jwt.sign(
                {
                    userInfo: user,
                },
                config.secret_key,
                {expiresIn: "15d"}
            );

            return {
                status: 200,
                message: "Đăng nhập thành công",
                access_token: access_token,
                refresh_token: refresh_token,
                user: user,
            };
        } else {
            return {status: 401, mess: "Email hoặc mật khẩu không đúng"};
        }
    } catch (error) {
        console.log(error);
        return {status: 500, mess: "Lỗi server"};
    }
}

async function editUser(id, token, body) {
    try {
        if (!token) {
            return {status: 401, message: "Không tìm thấy mã xác thực"};
        }

        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return {status: 400, message: "Token không hợp lệ"};
        }

        let verifyToken;
        try {
            verifyToken = jwt.verify(tokenParts[1], config.secret_key);
        } catch (error) {
            return {status: 403, message: "Mã xác thực không đúng"};
        }

        const user = await userModel.findById(id);
        if (!user) {
            return {status: 404, message: "Không tìm thấy tài khoản"};
        }

        // Chỉ update những field có giá trị
        const updateData = {};
        const fields = [
            "name",
            "phone",
            "password",
            "email",
            "address",
            "zipcode",
            "role",
        ];

        fields.forEach((field) => {
            if (body[field]) {
                updateData[field] = body[field];
            }
        });

        // Nếu có password mới thì hash trước khi update
        if (body.password) {
            const salt = bcrypt.genSaltSync(10);
            updateData.password = bcrypt.hashSync(body.password, salt);
        }

        await userModel.findByIdAndUpdate(id, updateData, {new: true});
        return {status: 200, message: "Sửa thông tin user thành công"};
    } catch (error) {
        console.error(error);
        return {status: 500, message: "Sửa thông tin user thất bại"};
    }
}

async function deleteUser(id, token) {
    try {
        if (!token) {
            return {status: 401, message: "Không tìm thấy mã xác thực"};
        }

        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return {status: 403, message: "Mã xác thực không hợp lệ"};
        }

        let decoded;
        try {
            decoded = jwt.verify(tokenParts[1], config.secret_key);
        } catch (error) {
            return {status: 403, message: "Mã xác thực không đúng"};
        }

        const user = await userModel.findById(id);
        if (!user) {
            return {status: 404, message: "Không tìm thấy tài khoản"};
        }

        await userModel.findByIdAndDelete(id);
        return {status: 200, message: "Xóa tài khoản thành công"};
    } catch (error) {
        console.error(error);
        return {status: 500, message: "Xóa tài khoản thất bại"};
    }
}

async function refreshToken(token) {
    if (!token) {
        return {status: 401, mess: "Không có refreshToken"};
    } else {
        const refresh_token = token.split(" ")[1];

        try {
            // verify sẽ trả về payload của token
            const verifyToken = jwt.verify(refresh_token, config.refresh_key);

            const new_access_token = jwt.sign(
                {
                    id: verifyToken._id,
                    role: verifyToken.role,
                },
                config.access_key,
                {expiresIn: "15m"}
            );

            const new_refresh_token = jwt.sign(
                {
                    id: verifyToken.id,
                    role: verifyToken.role,
                },
                config.refresh_key,
                {expiresIn: "30m"}
            );
            return {
                status: 200,
                access_token: new_access_token,
                refresh_token: new_refresh_token,
            };
        } catch (err) {
            console.log(err);
            return {status: 403, mess: "refreshToken không hợp lệ"};
        }
        }
}
