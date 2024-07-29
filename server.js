require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const testRoutes = require('./routes/test');
const testDetailRoutes = require('./routes/testDetail');
const  initDb  = require('./models/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes); // Usa las rutas de tests
app.use('/api/testdetail', testDetailRoutes); // Usa las rutas de tests

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
