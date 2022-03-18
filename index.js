const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const loginController = require('./controllers/loginController');
const talkerController = require('./controllers/talkerController');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const apiTalker = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// ______________________________________________________

// Exercício 7
app.get('/talker/search', talkerController.tokenController, async (req, res) => {
  const { q } = req.query;
  fs.readFile(apiTalker, 'utf8')
    .then((data) => {
      const dataJson = JSON.parse(data);
      if (!q) return res.status(200).json(dataJson);
      console.log(dataJson.every((t) => !t.name.includes(q)));
      if (dataJson.every((t) => !t.name.includes(q))) return res.status(200).json([]);
      const filteredTalker = dataJson.filter((t) => t.name.includes(q));
      return res.status(200).json(filteredTalker);
    })
    .catch((err) => console.log(err));
});

// Exercício 1
app.get('/talker', async (_req, res) => fs.readFile(apiTalker, 'utf8')
  .then((data) => res.status(200).json(JSON.parse(data)))
  .catch((_err) => console.log('erro')));

// Exercício 2
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  await fs.readFile(apiTalker, 'utf8')
    .then((data) => {
      if (JSON.parse(data).find((item) => item.id === Number(id))) {
        return res.status(200).json(JSON.parse(data).find((item) => item.id === Number(id)));
      }
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    })
    .catch((_err) => console.log('erro'));
});

// Exercício 3
app.post('/login', loginController.email, loginController.password, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

// Exercício 4
app.post('/talker', talkerController.talkerControllerArr, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  fs.readFile(apiTalker, 'utf8')
    .then(async (data) => {
      const dataJson = JSON.parse(data);
      const newId = dataJson[dataJson.length - 1].id + 1;
      dataJson.push({ name, age, id: newId, talk: { watchedAt, rate } });
      try {
        await fs.writeFile('./talker.json', JSON.stringify(dataJson));
        res.status(201).json({ name, age, id: newId, talk: { watchedAt, rate } });
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => console.log(err));
});

// Exercício 5
app.put('/talker/:id', talkerController.talkerControllerArr, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  await fs.readFile(apiTalker, 'utf8')
    .then(async (data) => {
      const dataJson = JSON.parse(data);
      if (dataJson.every((t) => t.id !== Number(id))) {
        return res.status(404).json({ message: `Talker com #${id} não encontrado` });
      }
      const editedTalkets = dataJson.map((t) => {
        if (t.id === Number(id)) return { name, age, id: Number(id), talk: { watchedAt, rate } };
        return t;
      });
      try {
        await fs.writeFile('./talker.json', JSON.stringify(editedTalkets));
        res.status(200).json({ name, age, id: Number(id), talk: { watchedAt, rate } });
      } catch (err) { console.log(err); }
    })
    .catch((err) => console.log(err));
});

// Exercícios 6
app.delete('/talker/:id', talkerController.tokenController, async (req, res) => {
  const { id } = req.params;
  await fs.readFile(apiTalker, 'utf8')
    .then(async (data) => {
      const dataJson = JSON.parse(data);
      if (dataJson.every((t) => t.id !== Number(id))) {
        return res.status(404).json({ message: `Talker com #${id} não encontrado` });
      }
      const editedTalkets = dataJson.filter((t) => t.id !== Number(id));
      try {
        await fs.writeFile('./talker.json', JSON.stringify(editedTalkets));
        res.status(204).end();
      } catch (err) { console.log(err); }
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log('Online');
});
