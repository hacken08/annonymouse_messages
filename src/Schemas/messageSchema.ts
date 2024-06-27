import * as yup from 'yup';

export const MessageSchema = yup.object({
    content: yup.string().required().max(300),
    createdAt: yup.date().default(new Date()),
})
