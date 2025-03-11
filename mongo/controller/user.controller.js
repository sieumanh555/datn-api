const userModel = require('../model/user/user.model')
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

let refreshTokenAll = [];


module.exports = {resign, getUser, login, deleteUser, requestRefreshToken, logoutUser, getIdUser}

async function resign(body) {
    try {
        const {email, name, pass, role, lastname, hinhanh, diachi, ngaysinh, gioitinh, numberphone} = body
        let user = await userModel.findOne({email: email})
        if (user) {
            throw new Error('Email đã tồn tại')
        }
        var salt = bcryptjs.genSaltSync(10); // tạo vòng lặp 10 lần
        var hash = bcryptjs.hashSync(pass, salt);
        user = new userModel({email, name, pass:hash, role, lastname, hinhanh, diachi, ngaysinh, gioitinh, numberphone})
        const result = await user.save()
        return result
    } catch (error) {
        console.log(error);
        throw error
    }
}

function generateAccessToken (user) {
    return jwt.sign({
        id: user.id,
        admin: user.role
    },
        "hydeptrai",
        {expiresIn: "15s"}
    );
}

function generateRefreshToken (user) {
    return jwt.sign({
        id: user.id,
        admin: user.role
    },
        "hydethuong",
        {expiresIn: "365d"}
    );
}

async function login(body, res) {
    try {
        const { email, pass } = body;
        let user = await userModel.findOne({ email: email });
        if (!user) {
            throw new Error('Email không tồn tại');
        }
        const isPasswordMatch = await bcrypt.compare(pass, user.pass);
        if (!isPasswordMatch) {
            throw new Error('Sai mật khẩu');
        }
        if (isPasswordMatch || user) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshTokenAll.push(refreshToken)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure:false,
                path:"/",
                sameSite: "strict"
            })
            return { status: true, message: "Đăng nhập thành công", accessToken, refreshToken};
        }
    } catch (error) {
        throw new Error(error.message || 'Lỗi server');
    }
}


async function requestRefreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return { status: false, message: "Bạn không thể vàos"};     
        }
        if (!refreshTokenAll.includes(refreshToken)) {
            return { status: false, message: "Token không phải của bạn", refreshToken};
        }
        const user = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, "hydethuong", (err, user) => {
                if (err) {
                    return reject(new Error("Lỗi xác thực token"));
                }
                resolve(user);
            });
        });
        refreshTokenAll = refreshTokenAll.filter((token) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokenAll.push(newRefreshToken);


        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure:false,
            path:"/",
            sameSite: "strict"
        });
        return {status: true, accessToken: newAccessToken};
    } catch (error) {
        return{status: false, message: error.message };
    }
}

async function logoutUser(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new Error("Lỗi");
    }
    res.clearCookie("refreshToken");
    refreshTokenAll = refreshTokenAll.filter(
        token => token !== refreshToken
    );
    return { status: true, message: "Đăng xuất thành công" };
}
async function deleteUser(id) {
    try {
        const userDel = await userModel.findByIdAndDelete(id)
        if(!userDel){
            throw new Error('Không tìm thấy user')
        }
        return userDel
    } catch (error) {
        console.log(error);
        throw error
    }
}



async function getUser() {
    try {
        const result1 = await userModel.find().sort({_id: 1})
        return result1
    } catch (error) {
        console.log(error);
        throw error
    }
}


async function getIdUser(id) {
    try {
        const result = await userModel.findById(id)
        return result
    } catch (error) {
        console.log(error);
        throw error   
    }
}