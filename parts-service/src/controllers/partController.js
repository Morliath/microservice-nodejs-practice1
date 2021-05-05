const Part = require("../models/Part");
const logger = require("../utils/logger");

exports.createPart = (req, res, next) => {
    const { title, content, partNumber } = req.body;
    logger.info(`Create new part request: title:${title}, content:${content} by user:${req.userData.email}`);
    const part = new Part({
        title: title,
        content: content,
        partNumber: partNumber,
        imagePath: req.file.filename,
        createdBy: req.userData.email
    });

    part.save().then(savedPart => {
        logger.info(`Successfully created ID: ${savedPart._id}`)
        res.status(201).json({
            message: 'Part saved succesfully',
            part: {
                id: savedPart._id,
                imagePath: savedPart.imagePath,
            }
        });
    })
        .catch(error => {
            logger.error(error.message || 'Persisting part failed');
            res.status(500).json({
                message: error.message || 'Persisting part failed'
            })
        })
}

exports.readPart = async (req, res, next) => {
    const searchText = req.query.searchText;
    logger.info(`Search request by ${searchText}`)
    let query;
    if (searchText) {
        query = {
            $or: [
                { title: { $regex: searchText, $options: 'i' } },
                { content: { $regex: searchText, $options: 'i' } },
                { partNumber: { $regex: searchText, $options: 'i' } },
                { createdBy: { $regex: searchText, $options: 'i' } }
            ]
        }
    }

    Part.find(query, (err, data) => {
        if (err) {
            logger.error(err.message || 'No data found')
            res.status(404).json({
                message: 'No data found'
            });
        } else {
            logger.info(`${data.length} entries found`);
            res.status(200).json(data.map(part => {
                return {
                    id: part._id,
                    title: part.title,
                    content: part.content,
                    partNumber: part.partNumber,
                    imagePath: part.imagePath,
                    createdBy: part.createdBy
                }
            }));
        }
    })
}

exports.updatePart = async (req, res, next) => {
    const { id, title, content, partNumber } = req.body;
    logger.info(`Update part request: id:${id}, title:${title}, content:${content} by user:${req.userData.email}`);

    let imagePath = req.body.imagePath;
    if (req.file) {
        imagePath = req.file.filename
    }

    const part = await Part.findById(id);

    part.title = title;
    part.content = content;
    part.partNumber = partNumber;
    part.imagePath = imagePath;

    part
        .save().then(savedDoc => {
            logger.info(`Update part id:${id}`);
            res.status(200).json({
                id: savedDoc._id,
                title: savedDoc.title,
                content: savedDoc.content,
                partNumber: savedDoc.partNumber,
                imagePath: savedDoc.imagePath,
                createdBy: savedDoc.createdBy
            })
        })
        .catch(err => {
            logger.error(err.message || 'Update fail');
            res.status(404).json({
                message: 'Update fail'
            });
        });
}

exports.deletePart = async (req, res, next) => {
    const id = req.params.id;

    logger.info(`Delete part request: id:${id}`);

    Part.deleteOne({ _id: id })
        .then(result => {
            logger.info(`Delete result: n: ${result.n}, ok: ${result.ok}, deletedCount: ${result.deletedCount}`);
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Part deleted!'
                });
            } else {
                throw 'Delete process failed, not found';
            }
        })
        .catch(err => {
            logger.error(err.message || 'Delete process failed')
            res.status(500).json({
                message: err.message || 'Delete process failed'
            })
        });
}