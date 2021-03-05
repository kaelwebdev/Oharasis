const nodemailer = require('nodemailer');
module.exports = (formulario) => {
 var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
 user: 'oharasis.registro@gmail.com', // Cambialo por tu email
 pass: 'wpneeuknseuhxqdu' //Cambialo por la password del correo o password de aplicacion(esta opcion se encuentra en gmail)
 }
 });
const mailOptions = {
 from: `"${formulario.nombre}" <${formulario.email}>`,
 to: 'oharasis.registro@gmail.com', // Cambia esta parte por el destinatario
 subject: `Registro ${formulario.tipo}`,
 html: `
 <strong>Nombre:</strong> ${formulario.nombre} <br/>
 <strong>Apellido:</strong> ${formulario.apellido} <br/>
 <strong>Alias:</strong> ${formulario.alias} <br/>
 <strong>Email:</strong> ${formulario.email} <br/>
 <strong>Password:</strong> ${formulario.password} <br/>
 <strong>Genero:</strong> ${formulario.genero} <br/>
 <strong>Tipo:</strong> ${formulario.tipo} <br/>
 <strong>Codigo:</strong> ${formulario.codigo} 
 `
 };
transporter.sendMail(mailOptions, function (err, info) {
 if (err)
 console.log(err)
 else
 console.log(info);
 });
}