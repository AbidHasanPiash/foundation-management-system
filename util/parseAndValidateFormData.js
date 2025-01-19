'use strict';

import { BadRequestError } from '@/util/asyncHandler';

import logger from '@/lib/logger';
import contentTypesConstants from '@/constants/contentTypes.constants';

import prepareFormDataForLogging from '@/util/prepareFormDataForLogging';
import getQueryParams from '@/util/getQueryParams';
import toSentenceCase from '@/util/toSentenceCase';
import convertToObjectId from '@/util/convertToObjectId';

const getNestedField = (obj, path) =>
    path.split('.').reduce((o, key) => o?.[key], obj);

const setNestedField = (obj, path, value) => {
    path.split('.').reduce((o, key, idx, arr) => {
        if (idx === arr.length - 1) {
            o[key] = o[key] !== undefined ? [].concat(o[key], value) : value;
        } else {
            o[key] = o[key] || {};
        }
        return o[key];
    }, obj);
};

const parseAndValidateFormData = async (request, context, mode, schema) => {
    const { params } = context;
    const arrayFields = {};
    const contentType = request.headers.get('Content-Type');

    let data = {};
    let userInput = {};

    if (contentType?.includes(contentTypesConstants.JSON)) {
        try {
            data = await request.json();
            if (
                (mode === 'create' || mode === 'update') &&
                !Object.keys(data).length
            ) {
                throw new BadRequestError(
                    'Request body is empty, expected data in JSON format.'
                );
            }
        } catch {
            throw new BadRequestError(
                'Invalid JSON body or empty request body.'
            );
        }
    } else if (
        contentType?.includes(contentTypesConstants.FORM_DATA) &&
        typeof request.formData === 'function'
    ) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            const arrayFieldMatch = key.match(/^(\w+)\[(\d+)](?:\.(\w+))?$/); // Updated regex to support nested fields
            if (arrayFieldMatch) {
                const [, fieldName, index, propName] = arrayFieldMatch;
                arrayFields[fieldName] = arrayFields[fieldName] || [];
                arrayFields[fieldName][index] =
                    arrayFields[fieldName][index] || {};
                if (propName) {
                    arrayFields[fieldName][index][propName] = value; // Assign nested properties
                } else {
                    Object.assign(arrayFields[fieldName][index], value); // Assign entire object
                }
            } else if (value instanceof File) {
                userInput[key] = userInput[key] || [];
                userInput[key].push(value);
            } else {
                setNestedField(userInput, key, value);
            }
        });

        // Convert array fields to the desired structure
        Object.keys(arrayFields).forEach((key) => {
            userInput[key] = arrayFields[key];
        });
    } else if (contentType !== null) {
        throw new BadRequestError('Unsupported content type');
    }

    data = { ...data, ...params?.query, ...params };
    logger.info(
        `Request: ${JSON.stringify(await prepareFormDataForLogging(data, { query: params?.query || {}, params }))}`
    );

    if (mode === 'create') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);
            if (value === undefined)
                throw new BadRequestError(
                    `Got undefined data in field: ${key}`
                );
            setNestedField(userInput, key, value);
        });
    } else if (mode === 'update') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);
            if (value !== undefined) setNestedField(userInput, key, value);
        });
    } else if (!Object.keys(data).length) {
        // throw new BadRequestError('Invalid request data');
    }

    ['id', 'email', 'categoryParams', 'type', 'dataId'].forEach((field) => {
        if (data[field]) userInput[field] = data[field];
    });

    const queryParams = getQueryParams(
        new URLSearchParams(new URL(request.url).search)
    );
    if (Object.keys(queryParams).length) {
        userInput = { ...userInput, ...queryParams };
        userInput.query = { ...queryParams };
    }

    if (typeof schema === 'function') {
        schema(toSentenceCase(params?.categoryParams.replace(/_/g, ' '))).parse(
            userInput
        );
    } else {
        schema.parse(userInput);
    }

    if (userInput['id']) {
        userInput.id = convertToObjectId(userInput.id);
    }

    return userInput;
};

export default parseAndValidateFormData;
