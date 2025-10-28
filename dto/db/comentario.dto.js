import Joi from "joi";

export const CreateComentarioDto = Joi.object({
	idp: Joi.number()
		.integer()
		.positive()
		.required()
		.messages({
			'number.base': 'idp debe ser un número',
			'number.integer': 'idp debe ser un número entero',
			'number.positive': 'idp debe ser positivo',
			'any.required': 'idp es requerido'
		}),

	idu: Joi.number()
		.integer()
		.positive()
		.required()
		.messages({
			'number.base': 'idu debe ser un número',
			'number.integer': 'idu debe ser un número entero',
			'number.positive': 'idu debe ser positivo',
			'any.required': 'idu es requerido'
		}),

	contenidoCom: Joi.string()
		.required()
		.messages({
			'string.base': 'contenidoCom debe ser texto',
			'string.empty': 'contenidoCom no puede estar vacío',
			'any.required': 'contenidoCom es requerido'
		}),

	likeNotLike: Joi.boolean()
		.required()
		.messages({
			'boolean.base': 'likeNotLike debe ser true o false',
			'any.required': 'likeNotLike es requerido'
		})
});

export const UpdateComentarioDto = Joi.object({
	contenidoCom: Joi.string()
		.required()
		.messages({
			'string.base': 'contenidoCom debe ser texto',
			'string.empty': 'contenidoCom no puede estar vacío',
			'any.required': 'contenidoCom es requerido'
		}),

	likeNotLike: Joi.boolean()
		.required()
		.messages({
			'boolean.base': 'likeNotLike debe ser true o false',
			'any.required': 'likeNotLike es requerido'
		})
});

export const AutorizarComentarioDto = Joi.object({
	iduAutorizador: Joi.number()
		.integer()
		.positive()
		.required()
		.messages({
			'number.base': 'iduAutorizador debe ser un número',
			'number.integer': 'iduAutorizador debe ser un número entero',
			'number.positive': 'iduAutorizador debe ser positivo',
			'any.required': 'iduAutorizador es requerido'
		})
});
