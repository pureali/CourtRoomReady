async function callBackendMethod(methodName, data = {}) {
    try {
        const response = await fetch(`/api/${methodName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error calling ${methodName}:`, error);
        throw error;
    }
}

export default callBackendMethod;