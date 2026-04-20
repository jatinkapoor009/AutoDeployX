document.addEventListener('DOMContentLoaded', () => {
    const actionForm = document.getElementById('actionForm');
    const userInput = document.getElementById('userInput');
    const outputArea = document.getElementById('outputArea');
    const outputName = document.getElementById('outputName');
    const submitBtn = document.getElementById('submitBtn');

    actionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Button loading state
        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;

        // Simulate a small delay for "DevOps processing" feel
        setTimeout(() => {
            const nameValue = userInput.value;
            
            // Show the output card
            outputName.innerText = nameValue;
            outputArea.classList.remove('hidden');

            // Reset button
            submitBtn.innerText = 'Execute';
            submitBtn.disabled = false;
            
            // Clear input
            userInput.value = '';
        }, 800);
    });
});
