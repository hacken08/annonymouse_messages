import * as yup from 'yup';

export const VerifyCodeSchema = yup.object({
    code: yup.string().length(6, "Must be 6 characters long."),
})
