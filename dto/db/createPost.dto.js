import Joi from "joi";

export const CreatePostDto = Joi.object({
	contenido: Joi.string().required(),
	idu: Joi.string().uuid().required(),
})
