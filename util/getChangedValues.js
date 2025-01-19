export const getChangedValues = (initialValues, currentValues) => {
    const changedValues = {};

    Object.keys(currentValues).forEach((key) => {
        const initialValue = initialValues[key];
        const currentValue = currentValues[key];

        if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
            // Deep check for arrays
            const arrayChanges = currentValue.filter((item, index) => {
                return (
                    JSON.stringify(item) !== JSON.stringify(initialValue[index])
                );
            });
            if (arrayChanges.length) {
                changedValues[key] = currentValue;
            }
        } else if (
            typeof initialValue === 'object' &&
            initialValue !== null &&
            typeof currentValue === 'object' &&
            currentValue !== null
        ) {
            // Recursively check nested objects
            const nestedChanges = getChangedValues(initialValue, currentValue);
            if (Object.keys(nestedChanges).length > 0) {
                changedValues[key] = nestedChanges;
            }
        } else if (initialValue !== currentValue) {
            // Direct comparison for primitive types
            changedValues[key] = currentValue;
        }
    });

    return changedValues;
};
