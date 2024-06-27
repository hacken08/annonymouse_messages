import * as yup from 'yup';

export const SignInSchema = yup.object({
    identifier: yup.string(),
    password: yup.string()
})
