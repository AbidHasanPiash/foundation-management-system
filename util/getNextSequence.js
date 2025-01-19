import CounterModel from '@/app/api/v1/(counter)/counter.model';

// Function to get the next sequence number
const getNextSequence = async (sequenceName) => {
    const result = await CounterModel.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create document if not exists
    );

    // Ensure seq is padded to 5 digits
    return result.seq.toString().padStart(5, '0');
};

export default getNextSequence;
