import joi from 'joi';

export type User = {
  id: string;
  userName: string;
  password: string;
  chat: string;
};

export type UserLogin = {
  userName: string;
  password: string;
};

export const userSchema = joi.object<User>({
  userName: joi.string().required(),

  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});
