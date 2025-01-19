import configurations from '@/configs/configurations';

const configuration = await configurations();

const allowedMethods = configuration.cors.allowedMethods;
const allowedOrigins = configuration.cors.allowedOrigins;

const corsOptions = {
    'Access-Control-Allow-Methods': allowedMethods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const corsConfiguration = {
    allowedOrigins,
    corsOptions,
};

export default corsConfiguration;
