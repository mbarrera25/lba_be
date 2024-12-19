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
const talonarioRoutes = require('./routes/book_payment');
const metodoDePagoRoutes = require('./routes/payment_method');
const currency = require('./routes/currency');
const exchangeRate = require('./routes/exchangeRate');
const solicitud = require('./routes/request');
const invoice = require('./routes/invoices');
const transaction = require('./routes/transaction');

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
app.use('/api/exchange-rate', exchangeRate);
app.use('/api/solicitudes', solicitud);
app.use('/api/invoice', invoice);
app.use('/api/transaction', transaction);

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
