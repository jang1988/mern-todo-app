const { Router } = require('express');
const User = require('../models/User');
const router = Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post(
  '/registration',
  [
    check('email', 'некоректная почта').isEmail(),
    check('password', 'некоректный пароль').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'некоректные данные при регистпации',
        });
      }

      const { email, password } = req.body;

      const isUsed = await User.findOne({ email });

      if (isUsed) {
        return res.status(300).json({ message: 'Данный email уже занят' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });
    } catch (error) {
      console.log('error: ', error);
    }
  },
);

router.post(
  '/login',
  [check('email', 'некоректная почта').isEmail(), check('password', 'некоректный пароль').exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'некоректные данные при авторизации',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Невереый email' });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Невереый пароль' });
      }

      const jwtSecret = '111';

      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

      res.json({ token, userId: user.id });
    } catch (error) {
      console.log('error: ', error);
    }
  },
);

module.exports = router;
