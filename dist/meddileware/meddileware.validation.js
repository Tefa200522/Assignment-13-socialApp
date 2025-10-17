"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation = (Schema) => {
    return async (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        };
        const validationRes = await Schema.safeParseAsync(data);
        if (!validationRes.success) {
            return res.status(422).json({
                validationError: JSON.parse(validationRes.error)
            });
        }
        next();
    };
};
exports.default = validation;
