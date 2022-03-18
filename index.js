const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const apiTalker = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => fs.readFile(apiTalker, 'utf8')
    .then((data) => res.status(200).json(JSON.parse(data)))
    .catch((_err) => console.log('erro')));

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  fs.readFile(apiTalker, 'utf8')
  .then((data) => {
    if (JSON.parse(data).find((item) => item.id === Number(id))) {
      return res.status(200).json(JSON.parse(data).find((item) => item.id === Number(id)));
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  })
  .catch((_err) => console.log('erro'));
});

app.listen(PORT, () => {
  console.log('Online');
});
