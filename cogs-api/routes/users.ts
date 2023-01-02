import {Router, Response} from "express"
import {AsyncHandler, RequestWithBody, ValidateSchema} from "../lib/middleware";
import {findByEmail, UserResponse} from "../model/user";
import yup, {SchemaOf} from "yup";
import {ErrorResponse} from "../model/error-response";
import {compare} from "bcrypt"
import {setLoginSession} from "../lib/auth-cookie";

export const userRouter = Router();

interface LoginRequest {
    email: string,
    password: string,
}

const loginRequestSchema: SchemaOf<LoginRequest> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})

userRouter.post(
    '/login',
    ValidateSchema(loginRequestSchema),
    AsyncHandler(async function (req: RequestWithBody<LoginRequest>, res: Response<UserResponse | ErrorResponse>) {
        try {
            const {email, password} = req.body;
            const user = await findByEmail(email)
            if(!user || !user.password) {
                res.status(404).json({error: "No user with that email"});
                return;
            }
            const valid = await compare(password, user.password)
            if(!valid) {
                res.status(400).json({error: "Invalid password"});
            }
            const userResponse = new UserResponse(user);
            await setLoginSession(res, {user: userResponse});

            res.status(200).json(userResponse);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({error: "Could not retrieve user"});
        }
    })
);
