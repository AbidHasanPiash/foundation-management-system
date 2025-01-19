export const handleCheckboxChange = (formik, fieldName) => (checked) => {
    formik.setFieldValue(fieldName, checked);
};

export const handleImageChange = (formik, fieldName) => (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
        formik.setFieldValue(fieldName, file); // Sets the file in Formik state
    }
};

export const clearField = (formik, fieldName) => {
    formik.setFieldValue(fieldName, null); // Resets the image field to null
};

// Common function for handling add and remove operations in Formik array fields
export const handleArrayFieldChange = (
    formik,
    actionType,
    fieldName,
    index = null
) => {
    const fieldArray = formik.values[fieldName];
    if (actionType === 'add') {
        formik.setFieldValue(fieldName, [...fieldArray, '']);
    } else if (actionType === 'remove' && index !== null) {
        const updatedArray = fieldArray.filter((_, i) => i !== index);
        formik.setFieldValue(fieldName, updatedArray);
    }
};

// #######################################################################
// #######################################################################
// #######################################################################
// #######################################################################

export const handleCheckboxChangeForForm =
    (setFieldValue, fieldName) => (checked) => {
        setFieldValue(fieldName, checked);
    };

export const handleImageChangeForForm =
    (setFieldValue, fieldName) => (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue(fieldName, file); // Sets the file in Formik state
        }
    };

export const handleArrayFieldChangeForForm = (
    { values, setFieldValue },
    actionType,
    fieldName,
    index = null
) => {
    const fieldArray = values[fieldName];
    if (actionType === 'add') {
        setFieldValue(fieldName, [...fieldArray, { name: '', file: null }]); // Add empty object for a new document
    } else if (actionType === 'remove' && index !== null) {
        const updatedArray = fieldArray.filter((_, i) => i !== index);
        setFieldValue(fieldName, updatedArray);
    }
};
