require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const testRoutes = require('./routes/test');
const testDetailRoutes = require('./routes/testDetail');
const analysisRoutes = require('./routes/analysis');
const analysisTestRoutes = require('./routes/analysistest');
const exchangeCurrency = require('./routes/exchangeCurrency');
const talonarioRoutes = require('./routes/talonario');
const metodoDePagoRoutes = require('./routes/metodoDePago')
const currency = require('./routes/currency')

const fetchAndSaveExchangeRate = require('./routes/scheduledTask');
const  initDb  = require('./models/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes); // Usa las rutas de tests
app.use('/api/testdetail', testDetailRoutes); // Usa las rutas de tests
app.use('/api/analisys', analysisRoutes); // Usa las rutas de tests
app.use('/api/analysisTest', analysisTestRoutes); // Usa las rutas de tests
app.use('/api/exchangeCurrency', exchangeCurrency); // Usa las rutas de tests
app.use('/api/talonarios', talonarioRoutes);
app.use('/api/metodos-de-pago', metodoDePagoRoutes);
app.use('/api/currency', currency);
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
