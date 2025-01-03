function generateUniqueId(questions) {
    const generateRandomId = () => {
        return `id-${Math.random().toString(36).slice(2, 11)}`;
    };

    let newId;
    do {
        newId = generateRandomId();
    } while (Array.isArray(questions) && questions.some(question => question?.id === newId));

    return newId;
}

export { generateUniqueId };
