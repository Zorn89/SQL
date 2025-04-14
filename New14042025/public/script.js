document.addEventListener('DOMContentLoaded', () => {
    const addTierForm = document.getElementById('addTierForm');
    const messageDiv = document.getElementById('message');

    addTierForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Verhindert das Standardmäßige Absenden des Formulars

        const formData = new FormData(addTierForm);
        const tierData = {
            tierart: formData.get('tierart'),
            name: formData.get('name'),
            krankheit: formData.get('krankheit'),
            age: parseInt(formData.get('age')),
            gewicht: parseFloat(formData.get('gewicht'))
        };

        try {
            const response = await fetch('/tiere', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tierData)
            });

            const result = await response.text(); // Liest den Antworttext

            if (response.ok) {
                messageDiv.textContent = result; // Zeigt die Erfolgsmeldung vom Server an
                messageDiv.style.color = 'green';
                addTierForm.reset(); // Leert das Formular
            } else {
                messageDiv.textContent = `Fehler beim Hinzufügen des Tiers: ${result}`; // Zeigt die Fehlermeldung vom Server an
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Netzwerkfehler:', error);
            messageDiv.textContent = 'Netzwerkfehler beim Senden der Anfrage.';
            messageDiv.style.color = 'red';
        }
    });
});