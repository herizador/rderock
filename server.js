// Requerimientos y configuración inicial
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'rderock')));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://ismel386827:M0ng02005$@suscriptores.fgeoe.mongodb.net/')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB', err));

// Esquema y modelo para historias
const storySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  story: String,
});

const Story = mongoose.model('Story', storySchema);

// Define el esquema y el modelo para los suscriptores
const subscriberSchema = new mongoose.Schema({
  email: String
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Configuración de NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // o tu servicio de correo preferido
  auth: {
    user: 'ismel386827@gmail.com',
    pass: 'Matematicas1$'
  }
});

// Función para enviar correos de recordatorio
async function sendReminderEmails() {
  try {
    const subscribers = await Subscriber.find();
    const emails = subscribers.map(sub => sub.email);

    const mailOptions = {
      from: 'ismel386827@gmail.com',
      to: emails,
      subject: '¡El evento está por comenzar!',
      text: 'Hola, te recordamos que el evento al que te suscribiste está por comenzar. ¡Te esperamos!'
    };

    await transporter.sendMail(mailOptions);
    console.log("Correos de recordatorio enviados.");
  } catch (error) {
    console.error("Error al enviar correos:", error);
  }
}

// Ruta para guardar historias
app.post('/submit-story', async (req, res) => {
  const { name, email, phone, subject, story } = req.body;

  const newStory = new Story({ name, email, phone, subject, story });

  try {
      await newStory.save();
      console.log('Historia guardada:', { name, email });
      res.json({ message: '¡Gracias por compartir tu historia!' });
  } catch (error) {
      console.error('Error al guardar la historia:', error);
      res.status(500).json({ error: 'Error al guardar la historia' });
  }
});

// Ruta para guardar el email de suscripción
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  const newSubscriber = new Subscriber({ email });

  try {
    await newSubscriber.save();
    console.log("Correo de suscripción recibido:", email);
    res.json({ message: "Suscripción exitosa" });
  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    res.status(500).json({ error: "Error al guardar la suscripción" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
