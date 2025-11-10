import ApiError from "@/utils/classes/ApiError";
import UserModel from "@/models/users";

import { ROLES } from "@/utils/constants";

import { validate, validatorAsyncErrorHandler, isRequired, isString, isIn } from "@/middlewares/validators";

export const registerValidators = [
  validate("body.username", [
    isRequired("من فضلك قم بإدخال اسم المستخدم."),
    isString("اسم المستخدم يجب أن يكون نصًا."),
    validatorAsyncErrorHandler(async (value, req, res, next) => {
      const user = await UserModel.findOne({ username: value });
      if (user) return next(new ApiError(409, "يوجد مستخدم بنفس الاسم بالفعل."));
      next();
    }),
  ]),
  validate("body.password", [isRequired("من فضلك قم بإدخال كلمة المرور."), isString("كلمة المرور يجب أن تكون نصًا.")]),
  validate("body.role", [isIn(ROLES, "الرجاء اختيار دور صحيح.")]),
];

export const loginValidators = [
  validate("body.username", [isRequired("من فضلك قم بإدخال اسم المستخدم.")]),
  validate("body.password", [isRequired("من فضلك قم بإدخال كلمة المرور.")]),
];
