import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
        'string.empty': 'Поле "title" должно быть заполнено',
        'any.required': 'Поле "title" обязательно',
      }),
    image: Joi.object({
      fileName: Joi.string().required().min(1),
      originalName: Joi.string().required().min(1),
    }).required(),
    category: Joi.string().required().min(1),
    description: Joi.string().min(1),
    price: Joi.number().min(0).allow(null),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    items: Joi.array().items(Joi.string().hex().length(24)).min(1).required()
      .messages({
        'array.min': 'Добавьте товары в заказ',
        'any.required': 'Добавьте товары в заказ',
      }),
    total: Joi.number().min(0).required().messages({
      'number.min': 'Общая сумма заказа должна быть неотрицательным числом',
      'any.required': 'Общая сумма заказа обязательна',
    }),
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Способ оплаты должен быть "card" или "online"',
      'any.required': 'Способ оплаты обязателен',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Укажите корректный email',
      'any.required': 'Email обязателен',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'Укажите номер телефона',
    }),
    address: Joi.string().required().messages({
      'any.required': 'Укажите адрес доставки',
    }),
  }),
});
