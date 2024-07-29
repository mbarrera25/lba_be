const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Registro de Usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    res.status(201).send('Usuario registrado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Inicio de Sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    
    if (!isMatch) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta protegida de ejemplo
router.get('/protected', authMiddleware, (req, res) => {
  res.send('Esta es una ruta protegida');
});

module.exports = router;
