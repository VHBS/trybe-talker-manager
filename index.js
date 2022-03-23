const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// ______________________________________________________

app.use('/', index);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Online');
});
