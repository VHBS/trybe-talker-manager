const fs = require('fs/promises');

const apiTalker = './talker.json';

const talkerController = async (_req, res) => fs.readFile(apiTalker, 'utf8')
  .then((data) => res.status(200).json(JSON.parse(data)))
  .catch((_err) => res.status(500).send('Não foi possivel ler o arquivo'));

const talkerByIdController = async (req, res) => {
  const { id } = req.params;

  await fs.readFile(apiTalker, 'utf8')
    .then((data) => {
      if (JSON.parse(data).find((item) => item.id === Number(id))) {
        return res.status(200).json(JSON.parse(data).find((item) => item.id === Number(id)));
      }
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    })
    .catch((_err) => console.log('erro'));
};

const talkerPostController = async (req, res) => {
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
};

const talkerPutController = async (req, res) => {
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
};

const talkerDeleteController = async (req, res) => {
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
};

const talkerSearchController = async (req, res) => {
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
};

module.exports = {
  talkerController,
  talkerByIdController,
  talkerPostController,
  talkerPutController,
  talkerDeleteController,
  talkerSearchController,
};
