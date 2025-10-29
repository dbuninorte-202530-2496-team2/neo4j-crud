import Joi from 'joi';

export const PaginationDto = Joi.object({
	limit: Joi.number()
		.integer()
		.min(1)
		.optional()
		.default(20)
		.messages({
			'number.base': 'limit debe ser un número',
			'number.integer': 'limit debe ser un número entero',
			'number.min': 'limit debe ser al menos 1'
		}),

	offset: Joi.number()
		.integer()
		.min(0)
		.optional()
		.default(0)
		.messages({
			'number.base': 'offset debe ser un número',
			'number.integer': 'offset debe ser un número entero',
			'number.min': 'offset no puede ser negativo'
		})
});
