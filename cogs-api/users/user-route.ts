import {Router, Response} from "express"
import {AsyncHandler, RequestWithBody, ValidateRequestBody} from "../lib/middleware";
import {putUser, findUserByEmail, UserResponse} from "./user";
import {SchemaOf} from "yup";
import * as yup from "yup";
import {ErrorResponse} from "../error-handling/error-response";
import {compare} from "bcrypt"
import {setLoginSession} from "../lib/auth";
import {sendEmail} from "../lib/send-email";
import {ProcessRegistrationEmail} from "./process-registration-email";

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
    ValidateRequestBody(loginRequestSchema),
    AsyncHandler(async function (req: RequestWithBody<LoginRequest>, res: Response<UserResponse | ErrorResponse>) {
        try {
            const {email, password} = req.body;
            const user = await findUserByEmail(email)
            if (!user || !user.password) {
                res.status(404).json({error: "No user with that email"});
                return;
            }
            const valid = await compare(password, user.password)
            if (!valid) {
                res.status(400).json({error: "Invalid password"});
            }
            const userResponse = new UserResponse(user);
            await setLoginSession(res, {user: userResponse});

            res.status(200).json(userResponse);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Could not retrieve user"});
        }
    })
);

interface RegisterRequest {
    email: string,
    name: string,
    event_uuid?: string,
}

const registerRequestSchema: SchemaOf<RegisterRequest> = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    event_uuid: yup.string().uuid().optional(),
})

userRouter.post(
    '/register',
    ValidateRequestBody(registerRequestSchema),
    AsyncHandler(async function (req: RequestWithBody<RegisterRequest>, res: Response<UserResponse | ErrorResponse>) {
        try {
            const {email, name} = req.body;
            const user = await findUserByEmail(email)
            if (user) {
                // TODO add to event??? Does name match?
                res.status(409).json({error: "There is already a user with that name"});
                return;
            }

            await putUser({name, email})
            // TODO add to event
            await sendEmail(new ProcessRegistrationEmail({name, email}));

            res.status(201).end();
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Could not create user"});
        }
    })
);

