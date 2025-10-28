import Joi from "joi";

export const PositiveIntDto = Joi.number().integer().required();
