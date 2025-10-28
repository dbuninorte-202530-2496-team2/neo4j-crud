import Joi from "joi";

export const UpdateUsuarioDto = Joi.object({
	nombre: Joi.string().required(),
});
