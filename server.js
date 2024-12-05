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
mongoose.connect(process.env.MONGO_URI)
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
// Esquema y modelos
const models = {
  Story: mongoose.model('Story', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    story: String,
  })),
  Subscriber: mongoose.model('Subscriber', new mongoose.Schema({
    email: String
  }))
};

// Configuración de NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // o tu servicio de correo preferido
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar correos de recordatorio
async function sendReminderEmails() {
// Función genérica para manejar datos de MongoDB
const handlePostRequest = async (Model, data, res) => {
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
    const newEntry = new Model(data);
    await newEntry.save();
    console.log('Dato guardado:', data);
    res.status(200).end(); // Respuesta vacía con estado 200 OK
  } catch (error) {
    console.error("Error al enviar correos:", error);
    console.error('Error al guardar el dato:', error);
    res.status(500).end(); // Respuesta vacía con estado 500 Internal Server Error
  }
}
};

// Ruta para guardar historias
app.post('/submit-story', async (req, res) => {
  const { name, email, phone, subject, story } = req.body;
// Rutas optimizadas
app.post('/submit-story', (req, res) => {
  handlePostRequest(models.Story, req.body, res);
});

  const newStory = new Story({ name, email, phone, subject, story });
app.post('/subscribe', (req, res) => {
  handlePostRequest(models.Subscriber, req.body, res);
});

// Ruta para enviar correos de recordatorio (opcional)
app.post('/send-reminders', async (req, res) => {
  try {
      await newStory.save();
      console.log('Historia guardada:', { name, email });
      res.json({ message: '¡Gracias por compartir tu historia!' });
  } catch (error) {
      console.error('Error al guardar la historia:', error);
      res.status(500).json({ error: 'Error al guardar la historia' });
  }
});
    const subscribers = await models.Subscriber.find();
    const emails = subscribers.map(sub => sub.email);

// Ruta para guardar el email de suscripción
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  const newSubscriber = new Subscriber({ email });
    if (emails.length > 0) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emails,
        subject: '¡El evento está por comenzar!',
        text: 'Hola, te recordamos que el evento al que te suscribiste está por comenzar. ¡Te esperamos!'
      });
    }

  try {
    await newSubscriber.save();
    console.log("Correo de suscripción recibido:", email);
    res.json({ message: "Suscripción exitosa" });
    res.status(200).end(); // Respuesta vacía con estado 200 OK
  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    res.status(500).json({ error: "Error al guardar la suscripción" });
    console.error('Error al enviar recordatorios:', error);
    res.status(500).end(); // Respuesta vacía con estado 500 Internal Server Error
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
