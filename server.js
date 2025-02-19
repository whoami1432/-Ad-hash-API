'use strict';

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');

const app = express();

const { requestId } = require('./service/uuidGenerator');
const { consoleWritter } = require('./service/consoleViewer');
const notFound = require('./middlewares/notFound');
const erorrHandler = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const everyReqDetails = require('./middlewares/everyReqCatcher');
const { mongoConnect } = require('./database/MongoDB');

const helloWorldRoute = require('./app/routes/helloWorld.route');
const usersRoute = require('./app/routes/users.route');
const tasksRoute = require('./app/routes/tasks.route');

const port = process.env.PORT;

process.on('uncaughtException', error => {
	console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled rejection:', error);
});

app.disable('x-powered-by');
app.use(limiter);
app.use(hpp());
app.use('*', cors());
app.use(compression({ level: 1 }));
app.use(requestId);
app.use(helmet());
app.use(express.json({ limit: '500mb', extended: true }));
app.use(everyReqDetails);

app.use('/api/user/', usersRoute);
app.use('/api/tasks/', tasksRoute);
app.use('/api/', helloWorldRoute);

app.get('/', (req, res) => res.status(200).send('Hello World!'));

// error handlers
app.use('*', notFound);
app.use(erorrHandler);

app.listen(port, async () => {
	consoleWritter(port);
	await mongoConnect();
});
