import nodemailer from 'nodemailer'
import { ApiError } from '../utils/ApiError.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  }
})

transporter.verify((error, success)=>{
  if(error){
    console.error('Error connecting to gmail server')
  }
  else{
    console.log('Email server is ready to send message')
  }
})

export const sendEmail = async (to, subject, text, html) =>{
  try{
     const info = await transporter.sendMail({
      from: `"HealthConnect" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
     })

     console.log('Message sent: %s', info.messageId)
     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
  catch(error){
    console.log('Error sending email:', error)
    throw new ApiError(500, "Unable to send verification email");
  }
}