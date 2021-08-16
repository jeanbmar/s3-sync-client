class CommandInput {
    assign(properties) {
        Object.entries(properties).forEach(([propertyName, propertyValue]) => {
            this[propertyName] = typeof propertyValue === 'function'
                ? propertyValue(this)
                : propertyValue;
        });
    }
}

module.exports = CommandInput;
