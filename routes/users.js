import express from 'express';
import advancedResults from '../middleware/advancedResults';
import User from '../models/User';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createUserByReferral,
} from '../controllers/users';

const router = express.Router();

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
router.route('/referral').post(createUserByReferral);

export default router;
