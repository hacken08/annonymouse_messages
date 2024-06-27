import { PassThrough } from 'stream';
import * as yup from 'yup';

const UserValidateSchema = yup.string()
    .max(20, "Name is too long")
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

const SignUpSchema = yup.object({
    username: UserValidateSchema,
    email: yup.string().required().email(),
    password: yup.string().min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at least 8 characters"),

})

export { UserValidateSchema, SignUpSchema };

