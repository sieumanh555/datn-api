const dayjs = require("dayjs");
const crypto = require("crypto");
const config = require("../../config");
module.exports = { zaloPayment, handleZaloCallback };

async function zaloPayment(products, total, orderDescription, orderInfo) {
  try {
    const key1 = config.key1;
    const callback_url = config.callback_url;
    const end_point_zalosb = config.end_point_zalo;

    const currentDate = dayjs();
    const tranId = currentDate.format("YYMMDD");
    const app_time = currentDate.valueOf();
    const app_trans_id = `${tranId}_${app_time}`;
    const order = {
      app_id: 2554,
      app_time: app_time,
      app_trans_id: app_trans_id,
      app_user: "Halo",
      bank_code: "",
      item: JSON.stringify(products),
      embed_data: JSON.stringify(orderInfo),
      amount: total,
      description: orderDescription,
      callback_url: callback_url,
      key1: key1,
      mac: "",
    };

    const hmac_input = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto
      .createHmac("sha256", key1)
      .update(hmac_input)
      .digest("hex");

    const response = await fetch(`${end_point_zalosb}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (data.return_code === 1) {
      return {
        status: 200,
        message: "Tạo dơn hàng (zalo) thành công",
        zaloResponse: data,
      };
    } else {
      console.log(">>> Tạo đơn hàng (zalo) thất bại: ", data);
      return {
        status: 500,
        message: ">>> Tạo đơn hàng (zalo) thất bại",
        zaloResponse: data,
      };
    }
  } catch (error) {
    console.log(">>> Check failed create order: ", error);
  }
}

async function handleZaloCallback(body) {
  try {
    const data = body;
    switch (data.return_code) {
      case 1: {
        return {
          status: 200,
          message: "Thanh toán thành công",
          zaloCallback: data,
        };
      }
      case 2: {
        return {
          status: 200,
          message: "Thanh toán thất bại",
          err_message: data.return_message || "Giao dịch bị từ chối",
        };
      }
      case 3: {
        return {
          status: 202,
          message: "Giao dịch đang xử lí",
          zaloCallback: data,
        };
      }
      case -1: {
        return {
          status: 400,
          message:
            "Lỗi xác thực từ ZaloPay (MAC sai hoặc thông tin không hợp lệ)",
          zaloCallback: data,
        };
      }
      default: {
        return {
          status: 400,
          message: "Mã return_code không xác định",
          zaloCallback: data,
        };
      }
    }
  } catch (error) {
    console.log(">>> Check failed create order: ", error);
    return { status: 500, message: "Lỗi" };
  }
}
