const formatModelName = (name) => {
    const modelName = name.charAt(0).toUpperCase() + name.slice(1);

    if (!modelName.match(/^[A-Za-z]+$/)) {
        console.debug(
            `Invalid model name provided: ${modelName}. Only alphabetic characters without spaces or special characters are allowed.`
        );
        return false;
    }

    return modelName;
};

export default formatModelName;
