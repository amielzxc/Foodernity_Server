import nodemailer from "nodemailer";

const sendMail = async (emailAddress, code) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "foodernityph@gmail.com",
        pass: "divvys-qYrte0-qiztit",
      },
    });

    let info = await transporter.sendMail({
      from: "foodernityph@gmail.com",
      to: emailAddress,
      subject: "Request change password",
      text: `The code is ' ${code}`,
      html: `<p>The code is ${code}</p>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("error");
  }
};

export default sendMail;
