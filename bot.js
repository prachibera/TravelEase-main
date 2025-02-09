document.addEventListener("DOMContentLoaded", function () {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbot = document.querySelector(".chatbot");
    const closeChatbot = document.querySelector(".chatbot header span");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.querySelector(".chat-input textarea");
    const chatBox = document.querySelector(".chatbox");

    // Predefined dataset of questions and answers
    const qaDataset = {
        "hello": "Hi there! How can I assist you today?",
        "how are you": "I'm just a bot, but I'm doing great! How about you?",
        "what is your name": "I'm your friendly chatbot!",
        "what is today's date": () => `Today's date is ${new Date().toDateString()}.`,
        "what time is it": () =>` The current time is ${new Date().toLocaleTimeString()}.`,
        "bye": "Goodbye! Have a great day!",
        "who created you": "I was created by a developer to assist you!",
        "thank you": "You're welcome! Happy to help."
    };

    // Toggle Chatbot
    chatbotToggler.addEventListener("click", () => {
        document.body.classList.toggle("show-chatbot");
    });

    // Close Chatbot
    closeChatbot.addEventListener("click", () => {
        document.body.classList.remove("show-chatbot");
    });

    // Send Message Function
    function sendMessage() {
        let message = userInput.value.trim().toLowerCase();
        if (message === "") return;

        // Add User Message to Chat
        appendMessage("outgoing", message);
        userInput.value = "";
        setTimeout(() => {
            botReply(message);
        }, 500);
    }

    // Append messages to chatbox
    function appendMessage(type, text) {
        let chatMessage = document.createElement("li");
        chatMessage.classList.add("chat", type);
        chatMessage.innerHTML = `<p>${text}</p>`;
        chatBox.appendChild(chatMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Bot response logic
    function botReply(message) {
        let response = qaDataset[message] || "I'm not sure how to respond. Can you ask something else?";
        response = typeof response === "function" ? response() : response;
        appendMessage("incoming", response);
    }

    // Handle "Enter" Key Press
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send Button Click Event
    sendBtn.addEventListener("click", sendMessage);
});