import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

const userController = new UserController();

router.route('/').post(userController.create);

export { router as userRouter };
