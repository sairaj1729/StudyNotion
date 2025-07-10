const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
const Contact = require("../models/Contact"); 

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  console.log(req.body);

  try {
    // Save data to DB
    const contactData = new Contact({
      email,
      firstname,
      lastname,
      message,
      phoneNo,
      countrycode,
    });
    await contactData.save();

    const emailRes = await mailSender(
      email,
      "Your Data Sent Successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    console.log("Email Res ", emailRes);

    return res.json({
      success: true,
      message: "Email sent and data saved successfully",
    });
  } catch (error) {
    console.log("Error", error);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
