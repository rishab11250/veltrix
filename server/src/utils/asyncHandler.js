/**
 * Wraps an async function to catch any errors and pass them to the next middleware.
 * Eliminates the need for repetitive try-catch blocks in controllers.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asyncHandler;
