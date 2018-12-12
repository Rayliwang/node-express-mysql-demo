
import express from 'express';
import user from '../controllers/user';
import { validate } from '../libs/middleware';

var router = express.Router();

/* GET users listing. */
router.get('/', validate('getUsers'), user.getUsers);
router.post('/', validate('addUser'), user.addUser);
router.put('/:id', validate('updateUser'), user.updateUser);
router.delete('/', validate('deleteUsers'), user.deleteUsers);
export default router;
