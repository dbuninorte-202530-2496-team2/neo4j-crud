import Joi from "joi";

export const CreateUsuarioDto = Joi.object({
	nombre: Joi.string()
		.required()
		.messages({
			'string.base': 'nombre debe ser texto',
			'string.empty': 'nombre no puede estar vacío',
			'any.required': 'nombre es requerido'
		})
});

export const UpdateUsuarioDto = Joi.object({
	nombre: Joi.string()
		.required()
		.messages({
			'string.base': 'nombre debe ser texto',
			'string.empty': 'nombre no puede estar vacío',
			'any.required': 'nombre es requerido'
		})
});
