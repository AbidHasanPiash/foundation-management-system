import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const generate6DigitFromUUID = () => {
    const uuid = uuidv4();
    const hash = crypto.createHash('sha256').update(uuid).digest('hex');
    const sixDigitId = parseInt(hash.slice(0, 6), 16)
        .toString()
        .padStart(6, '0')
        .slice(0, 6);

    return sixDigitId;
};

export default generate6DigitFromUUID;
