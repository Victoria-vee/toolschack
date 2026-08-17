import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { validateBody } from './user.middleware';
import { BadRequestError} from '../error';

const router = Router();


interface RegisterInput { username: string; email: string; password: string; }
interface LoginInput { email: string; password: string; }

router.post('/register', validateBody<RegisterInput>(['username', 'email', 'password']), async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.exists({ $or: [{ email }] });
    if (userExists) {
      throw new BadRequestError('Email already exists');
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({username, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully', userToken: newUser._id });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateBody<LoginInput>(['email', 'password']), async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError('Email invalid');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new BadRequestError('Password Invalid');

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, message: "Login successful! Welcome to GoodTools!" });
  } catch (error) {
    next(error);
  }
});

export default router;