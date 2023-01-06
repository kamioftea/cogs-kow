import {Request, Response, Router} from "express"
import {Authenticated, getResetKey, Role} from "../../lib/auth";
import {findUserByEmail, UserResponse} from "../user";
import {AsyncHandler} from "../../lib/middleware";
import {ErrorResponse} from "../../error-handling/error-response";
import {sendEmail} from "../../lib/send-email";
import {VerifyAccountEmail} from "../verify-account-email";

export const userAdminRouter = Router();

userAdminRouter.post(
    '/approve-register/:email',
    Authenticated(Role.ADMIN),
    AsyncHandler(async (req: Request, res: Response<UserResponse | ErrorResponse>) => {
        try {
            const user = await findUserByEmail(req.params.email);
            if (!user) {
                res.status(404).json({error: "Could not find user with that email"});
                return;
            }
            const resetKey = await getResetKey(user);
            await sendEmail(new VerifyAccountEmail(new UserResponse(user), resetKey))
            res.status(201).send();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({error: "Could not approve user"});
        }
    })
);
