import Joi from "joi";

export const PositiveIntDto = Joi.number()
	.integer()
	.positive()
	.required()
	.messages({
		'number.base': 'Debe ser un número',
		'number.integer': 'Debe ser un número entero',
		'number.positive': 'Debe ser un número positivo',
		'any.required': 'Este campo es requerido'
	});
