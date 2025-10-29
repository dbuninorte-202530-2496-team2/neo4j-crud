import Joi from "joi";

export const CreatePostDto = Joi.object({
	contenido: Joi.string()
		.required()
		.messages({
			'string.base': 'contenido debe ser texto',
			'string.empty': 'contenido no puede estar vacío',
			'any.required': 'contenido es requerido'
		}),

	idu: Joi.string()
		.uuid()
		.required()
		.messages({
			'string.base': 'idu debe ser texto',
			'string.guid': 'idu debe ser un UUID válido',
			'any.required': 'idu es requerido'
		})
});

export const UpdatePostDto = Joi.object({
	contenido: Joi.string()
		.required()
		.messages({
			'string.base': 'contenido debe ser texto',
			'string.empty': 'contenido no puede estar vacío',
			'any.required': 'contenido es requerido'
		})
});
