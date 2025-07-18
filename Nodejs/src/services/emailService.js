require("dotenv").config();
import nodemailer from "nodemailer";
const fs = require("fs");

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",// Cấu hình máy chủ SMTP của Gmail
    port: 587,// Cổng 587 cho giao thức SMTP
    secure: false, 
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // Gửi email
  let info = await transporter.sendMail({
    from: '"Đỗ Công Chiến 👻" <dochienhcb@gmail.com>', // Địa chỉ email người gửi
    to: dataSend.receiverEmail, // Địa chỉ email người nhận
    subject: "Thông tin đặt lịch khám bệnh", // Tiêu đề email
    html: getBodyHTMLEmail(dataSend),// Nội dung email dưới dạng HTML
  });
};

// Hàm trả về nội dung HTML của email cho từng ngôn ngữ (tiếng Việt hoặc tiếng Anh)
let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên mywebsite</p>
<p>Thông tin đặt lịch khám bệnh:</p>
<div><b>Thời gian: ${dataSend.time}</b></div>
<div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

<p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh.</p>
<div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>

<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>You received this email because you booked an online medical appointment on mywebsite</p>
    <p>Information to schedule an appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    
    <p>If the above information is true, please click on the link below to complete the procedure to book an appointment.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    
    <div>Sincerely thank!</div>
    `;
  }
  return result;
};
  // Gửi email có tệp đính kèm
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên mywebsite</p>
<p>Thông tin đơn thuốc được gửi trong file đính kèm.</p>
<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>You received this email because you booked an online medical appointment on mywebsite</p>
    <p>bla bla</p>
    <div>Sincerely thank!</div>
    `;
  }
  return result;
};


// Hàm gửi email có tệp đính kèm 
let getBodyHTMLEmailSheet = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Thông tin phiếu kết quả khám bệnh được gửi trong file đính kèm.</p>
<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>Information on the medical examination result sheet is sent in the attached file.</p>
    <div>Sincerely thank!</div>
    `;
  }
  return result;
};
  // Gửi email có tệp đính kèm
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      // Send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Đỗ Công Chiến 👻" <dochienhcb@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đơn thuốc", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `${new Date().getTime()}-${
              dataSend.pdf_remedy
            }`,
            content: fs.createReadStream('src/assets/pdf/remedy/'+dataSend.pdf_remedy),
          },
        ],
      });

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

let sendSheet = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Đỗ Công Chiến 👻" <dochienhcb@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin phiếu kết quả khám bệnh", // Subject line
        html: getBodyHTMLEmailSheet(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `${new Date().getTime()}-${
              dataSend.pdf_sheet_medical_examination_result
            }`,
            content: fs.createReadStream('src/assets/pdf/sheet/'+dataSend.pdf_sheet_medical_examination_result),
          },
        ],
      });

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};


let getBodyHTMLEmailInvoice = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Thông tin hóa đơn khám bệnh được gửi trong file đính kèm.</p>
<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>Medical invoice is sent in the attached file.</p>
    <div>Sincerely thank!</div>
    `;
  }
  return result;
};

let sendInvoice = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Đỗ Công Chiến 👻" <dochienhcb@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin hóa đơn khám bệnh", // Subject line
        html: getBodyHTMLEmailInvoice(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `${new Date().getTime()}-${
              dataSend.pdf_invoice
            }`,
            content: fs.createReadStream('src/assets/pdf/invoice/'+dataSend.pdf_invoice),
          },
        ],
      });

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};


let sendForgotPasswordEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Đỗ Công Chiến 👻" <dochienhcb@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin lấy lại mật khẩu", // Subject line
    html: getBodyHTMLEmailForgotPassword(dataSend),
  });
};

let getBodyHTMLEmailForgotPassword = (dataSend) => {
  let result = "";
  result = `
<h3><b>Xin chào!</b></h3>
<p>Bạn nhận được email này vì đã yêu cầu lấy lại mật khẩu do quên mật khẩu</p>

<p>Nếu yêu cầu lấy lại mật khẩu là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn tất thủ tục lấy lại mật khẩu.</p>
<div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>

<div>Nếu bạn không yêu cầu lấy lại mật khẩu, hãy bỏ qua email này!</div>
<div>Xin chân thành cảm ơn!</div>
`;
  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
  sendForgotPasswordEmail: sendForgotPasswordEmail,
  sendSheet:sendSheet,
  sendInvoice:sendInvoice
};
