const { fsReader, fsWriter } = require('../services/fs');

const talkerController = async (_req, res, next) => {
  const talkers = await fsReader(next);
  return res.status(200).json(talkers);
};

const talkerByIdController = async (req, res, next) => {
  const { id } = req.params;

  const talkers = await fsReader(next);

  const finderTalker = talkers.find((item) => item.id === Number(id));

  if (!finderTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(talkers.find((item) => item.id === Number(id)));
};

const talkerPostController = async (req, res, next) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;

  const talkers = await fsReader(next);

  const newId = talkers[talkers.length - 1].id + 1;

  talkers.push({ name, age, id: newId, talk: { watchedAt, rate } });

  await fsWriter(talkers, next);

  res.status(201).json({ name, age, id: newId, talk: { watchedAt, rate } });
};

const talkerPutController = async (req, res, next) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;

  const talkers = await fsReader(next);

  if (talkers.every((t) => t.id !== Number(id))) {
    return res.status(404).json({ message: `Talker com #${id} não encontrado` });
  }

  const editedTalkets = talkers.map((t) => {
    if (t.id === Number(id)) return { name, age, id: Number(id), talk: { watchedAt, rate } };
    return t;
  });

  await fsWriter(editedTalkets);

  return res.status(200).json({ name, age, id: Number(id), talk: { watchedAt, rate } });
  // res.send('ok');
};

const talkerDeleteController = async (req, res, next) => {
  const { id } = req.params;

  const talkers = await fsReader(next);

  if (talkers.every((t) => t.id !== Number(id))) {
    return res.status(404).json({ message: `Talker com #${id} não encontrado` });
  }

  const editedTalkets = talkers.filter((t) => t.id !== Number(id));

  await fsWriter(editedTalkets);
  res.status(204).end();
};

const talkerSearchController = async (req, res, next) => {
  const { q } = req.query;

  const talkers = await fsReader(next);

  if (!q) return res.status(200).json(talkers);

  if (talkers.every((t) => !t.name.includes(q))) return res.status(200).json([]);

  const filteredTalker = talkers.filter((t) => t.name.includes(q));
  return res.status(200).json(filteredTalker);
};

module.exports = {
  talkerController,
  talkerByIdController,
  talkerPostController,
  talkerPutController,
  talkerDeleteController,
  talkerSearchController,
};
