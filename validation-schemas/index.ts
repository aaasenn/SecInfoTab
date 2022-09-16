import * as yup from 'yup';

export const invalidCharsforQA = /[!@$^&.?^${}()|[\]\\]/g;
export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$/;
export const simpleExp = /^(?=.*?[A-Z])(?=.*?[a-z])/;

export const creatingPasswordSchema = yup.object().shape({
  passwordCurrent: yup
    .string()
    .matches(
      simpleExp,
      'Password must be at least 6 characters long, include lowercase and capital letters, numbers and special characters'
    )
    .notRequired(),

  password: yup
    .string()
    .matches(
      passwordRegExp,
      'Password must be at least 6 characters long, include lowercase and capital letters, numbers and special characters'
    )
    .notOneOf([yup.ref('currentPassword'), null], 'New password should be different from current')
    .notRequired(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .notRequired(),
});
export const securityAnswerSchema = yup.object().shape({
  securityAnswer: yup
    .string()
    .max(50, 'Security question must be less than 50 characters')
    .min(5)
    .required()
    .test('Invalid characters', 'Invalid characters', (value): any => value && !value.match(invalidCharsforQA)),
});
