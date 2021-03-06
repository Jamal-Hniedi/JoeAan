const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.find(req.filter);
        res.status(200)
            .json({
                status: 'success',
                results: docs.length,
                data: {
                    docs
                }
            });
    });

exports.getOneById = Model =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (req.populateOptions) query = query.populate(req.populateOptions);
        const doc = await query;
        if (!doc) return next(new AppError('No document found with that id!'), 404);
        res.status(200)
            .json({
                status: 'success',
                data: {
                    doc
                }
            });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201)
            .json({
                status: 'success',
                data: {
                    doc
                }
            });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(
            req.params.id, req.body, {
                new: true,
                runValidators: true
            });
        if (!doc) next(new AppError('No document found with that ID!', 404));
        res.status(200)
            .json({
                status: 'success',
                data: {
                    doc
                }
            });
    });

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) return next(new AppError('No document found with that id!'), 404);
        res.status(204)
            .json({
                status: 'success',
                data: null
            });
    });
