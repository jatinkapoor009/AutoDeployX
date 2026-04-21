// Button aur Input ko select karna
const btn = document.getElementById('btn');
const input = document.getElementById('userName');
const outputDiv = document.getElementById('output');
const messagePara = document.getElementById('message');

// Button click hone par kya hoga
btn.addEventListener('click', () => {
    const name = input.value;

    if (name.trim() === "") {
        alert("Please enter a name!");
    } else {
        // Output dikhana
        outputDiv.classList.remove('hidden');
        messagePara.innerText = `Hello ${name}, AutoDeployX is running successfully! ✅`;
        console.log("Pipeline executed for:", name);
    }
});
