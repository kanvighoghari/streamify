const resend = require("../lib/resend")
const createWelcomeEmailTemplate = require("../emails/emailTemplate")

const sendWelcomeEmail = async (email,name,clientURL)=>{
    const {data , error} = await resend.resendClient.emails.send({
        from :`${resend.sender.name} <${resend.sender.email}>`,
        to:email,
        subject: "Welcome to streamify",
        html: createWelcomeEmailTemplate(name , clientURL)

    })

    if(error){
        console.log("error sending emails")
        throw new Error("Failed to send new email")
    }

    console.log("Welocme email sent successfully" , data)
}
 
module.exports = sendWelcomeEmail
