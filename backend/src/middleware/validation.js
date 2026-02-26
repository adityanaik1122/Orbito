/**
 * Request Validation Middleware
 * 
 * Validates incoming request data using Joi schemas
 */

const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation error', { errors, path: req.path });

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: errors
      });
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // Itinerary generation
  generateItinerary: Joi.object({
    destination: Joi.string().required().min(2).max(100).trim(),
    startDate: Joi.date().iso().required().min('now'),
    endDate: Joi.date().iso().required().greater(Joi.ref('startDate')),
    preferences: Joi.string().max(500).trim().allow('', null),
    budget: Joi.string().valid('budget', 'moderate', 'luxury').allow(null),
    travelers: Joi.number().integer().min(1).max(20).allow(null)
  }),

  // Save itinerary
  saveItinerary: Joi.object({
    title: Joi.string().required().min(3).max(200).trim(),
    destination: Joi.string().required().min(2).max(100).trim(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    days: Joi.array().items(Joi.object({
      day: Joi.number().integer().min(1).required(),
      date: Joi.date().iso().required(),
      activities: Joi.array().items(Joi.object()).required()
    })).required(),
    totalBudget: Joi.number().min(0).allow(null),
    notes: Joi.string().max(1000).trim().allow('', null)
  }),

  // Tour booking
  createBooking: Joi.object({
    tourId: Joi.string().required().trim(),
    tourDate: Joi.date().iso().required().min('now'),
    numAdults: Joi.number().integer().min(1).max(20).required(),
    numChildren: Joi.number().integer().min(0).max(20).default(0),
    customerName: Joi.string().required().min(2).max(100).trim(),
    customerEmail: Joi.string().email().required().trim().lowercase(),
    customerPhone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).allow('', null),
    specialRequirements: Joi.string().max(500).trim().allow('', null),
    totalAmount: Joi.number().min(0).required()
  }),

  // AI chat
  aiChat: Joi.object({
    message: Joi.string().required().min(1).max(1000).trim(),
    context: Joi.object().allow(null)
  }),

  // Tour filters
  tourFilters: Joi.object({
    destination: Joi.string().max(100).trim().allow('', null),
    category: Joi.string().max(50).trim().allow('', null),
    minPrice: Joi.number().min(0).allow(null),
    maxPrice: Joi.number().min(0).allow(null),
    duration: Joi.string().allow('', null),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  }),

  // User registration
  register: Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().min(8).max(100).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    fullName: Joi.string().min(2).max(100).trim().allow('', null)
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required()
  }),

  // Email validation
  email: Joi.object({
    email: Joi.string().email().required().trim().lowercase()
  }),

  // ID parameter
  id: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // Slug parameter
  slug: Joi.object({
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required()
  })
};

module.exports = {
  validate,
  schemas
};
