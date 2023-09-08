const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) =>{
	const chatLi = document.createElement("li");
	chatLi.classList.add("chat", className);
	let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
	chatLi.innerHTML = chatContent;
	chatLi.querySelector("p").textContent = message;
	return chatLi;
}

const generateResponse = (IncomingChatLi) => {
	const API_URL = "http://localhost:8080";
	// const API_URL = "https://chatbot-gpt-2553bc3b5923.herokuapp.com";
	const messageElement = IncomingChatLi.querySelector("p")

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{role: "user", content: userMessage}]
		})
	}
	fetch(`${API_URL}/v1/chat/completions`, requestOptions).then(res => res.json()).then(data => {
		messageElement.textContent = data.choices[0].message.content;
	}).catch((error) =>{
		messageElement.classList.add("error");
		messageElement.textContent = "Opps! Something went wrong. Please try again."
	}).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
	userMessage = chatInput.value.trim();
	if(!userMessage) return;
	chatInput.value = "";
	chatInput.style.height = `${inputInitHeight}px`;

	chatbox.appendChild(createChatLi(userMessage, "outgoing"));
	chatbox.scrollTo(0, chatbox.scrollHeight);

	setTimeout(() =>{
		const IncomingChatLi = createChatLi("Thinking...", "incoming");
		chatbox.appendChild(IncomingChatLi);
		chatbox.scrollTo(0, chatbox.scrollHeight);
		generateResponse(IncomingChatLi);
	}, 600);
}

chatInput.addEventListener("input", () =>{
	chatInput.style.height = `${inputInitHeight}px`;
	chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) =>{
	if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
		e.preventDefault();
		handleChat();
	}
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));