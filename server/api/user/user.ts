import { User } from '../../models';
import { generateToken } from '../../models/user/User';
import { Router } from 'express';

export const userRoute = Router();

userRoute.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error('Fill full description');
    }
    const user = await User.findOne({ username });
    if (!user || !User.isPasswordValid(password, user.hashPassword)) {
      throw new Error('Invalid credentials!');
    }

    user.token = generateToken(user.username);
    const updatedUser = await user.save();

    res.json({ user: updatedUser });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

userRoute.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new Error('No token provided');
    }
    const user = await User.findOne({ token });
    if (!user) {
      throw new Error('Invalid credentials!');
    }

    res.json({ user });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});
