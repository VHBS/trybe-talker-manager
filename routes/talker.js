const express = require('express');

const { talkerControllerArr,
  tokenController,
} = require('../middlewares/talkerVerification');

const { talkerController, 
  talkerByIdController,
  talkerPostController,
  talkerPutController,
  talkerDeleteController,
  talkerSearchController,
} = require('../controllers/talkerController');

const router = express.Router();

router.get('/search', tokenController, talkerSearchController);

router.delete('/:id', tokenController, talkerDeleteController);

router.put('/:id', talkerControllerArr, talkerPutController);

router.get('/:id', talkerByIdController);

router.get('/', talkerController);

router.post('/', talkerControllerArr, talkerPostController);

module.exports = router;