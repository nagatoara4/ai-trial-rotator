const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const accountsRouter = require('./routes/accounts');
const providersRouter = require('./routes/providers');
const rotateRouter = require('./routes/rotate');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

// API routes
app.use('/api/accounts', accountsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/rotate', rotateRouter);
app.use('/api/health', healthRouter);

// Serve dashboard in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dashboard/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dashboard/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`AI Trial Rotator running on http://localhost:${PORT}`);
});
