module.exports = class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        console.log('AppError:', statusCode);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constuctor);
    }
}

