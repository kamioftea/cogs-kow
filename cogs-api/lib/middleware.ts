import {Request, Response, NextFunction} from "express";
import {SchemaOf} from "yup"

export interface RequestWithBody<T> extends Express.Request {
    body: T
}

export const AsyncHandler = <Req, Res>(handler: (req: Request<Req>, res: Response<Res>) => Promise<void>) =>
    (req: Request<Req>, res: Response<Res>, next: NextFunction) =>
        Promise.resolve(handler(req, res))
            .catch(next);


export const ValidateRequestBody = <Req> (schema: SchemaOf<Req>) =>
    (req: RequestWithBody<Req>, res: Response, next: NextFunction) =>
        schema.validate(req.body, {strict: false, stripUnknown: true}).then(
            validated => {
                req.body = <Req> validated;
                next()
            },
            err => res.status(400).json(err),
        )
