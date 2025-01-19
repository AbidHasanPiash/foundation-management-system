import mongoose from 'mongoose';

const convertToObjectId = (id) => new mongoose.Types.ObjectId(id);

export default convertToObjectId;
