import Joi from "joi";

export const UpdatePostDto = Joi.object({
	contenido: Joi.string().required(),
})
