const tokenController = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });

  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  next();
};

const nameController = (req, _res, next) => {
  const { name } = req.body;

  const nameNotFound = { message: 'O campo "name" é obrigatório' };
  const nameTooShort = { message: 'O "name" deve ter pelo menos 3 caracteres' };

  if (!name) throw new Error(nameNotFound.message);

  if (name && name.length < 3) throw new Error(nameTooShort.message);

  next();
};

const ageController = (req, _res, next) => {
  const { age } = req.body;

  const ageNotFound = { message: 'O campo "age" é obrigatório' };
  const talkerTooYoung = { message: 'A pessoa palestrante deve ser maior de idade' };

  if (!age) throw new Error(ageNotFound.message);

  if (Number(age) < 18) throw new Error(talkerTooYoung.message);

  next();
};

const talkObjController = (req, _res, next) => {
  const { talk } = req.body;

  const talkNotFound = {
    message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  };

  if (!talk) throw new Error(talkNotFound.message);

  next();
};

const talkController = (req, _res, next) => {
  const { talk: { watchedAt, rate } } = req.body;

  const talkNotFound = {
    message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  };

  if (rate !== 0 && (!watchedAt || !rate)) {
    throw new Error(talkNotFound.message);
  }

  next();
};

const talkDateController = (req, _res, next) => {
  const { talk: { watchedAt } } = req.body;
  const date = watchedAt.split('/');

  const wrongDate = { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };

  if (date.length !== 3
    || Number(date[0]) > 31
    || Number(date[1]) > 12) {
      throw new Error(wrongDate.message);
  }

  next();
};

const talkRateController = (req, _res, next) => {
  const { talk: { rate } } = req.body;

  const rateWrong = {
    message: 'O campo "rate" deve ser um inteiro de 1 à 5',
  };

  if (Number(rate) < 1 || Number(rate) > 5) throw new Error(rateWrong.message);

  next();
};

const talkerControllerArr = [
  tokenController,
  nameController,
  ageController,
  talkObjController,
  talkController,
  talkDateController,
  talkRateController,
];

module.exports = { talkerControllerArr, 
  tokenController,

  nameController,
  ageController,
  talkObjController,
  talkController,
  talkDateController,
  talkRateController,

};