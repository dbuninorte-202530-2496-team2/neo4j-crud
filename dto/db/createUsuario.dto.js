import Joi from "joi";

export const CreateUsuarioDto = Joi.object({
	nombre: Joi.string().required()
});
