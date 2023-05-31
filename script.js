const input = document.querySelector("#word")
const select = document.querySelector("#select")
const btn = document.querySelector("#btn")
const textarea = document.querySelector(".txt")
const paragraph = document.querySelector(".error")

const synth = document.querySelector("#synth")
const synthSelect = document.querySelector("#voice")
const synthInput = document.querySelector("#volume")
const synthRate = document.querySelector("#rate")
const synthBtnSpeak = document.querySelector("#speak")
const synthBtnStop = document.querySelector("#stop")

let selTxt
let div

const typeSelect = async () => {
	const API_KEY = "9556836d5emsha94b903c8dce84ap1067fbjsn0931cfa53b42"
	selTxt = select.options[select.selectedIndex]

	const url = `https://wordsapiv1.p.rapidapi.com/words/${input.value}/${selTxt.innerHTML}`
	const options = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": `${API_KEY}`,
			"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
		},
	}

	try {
		const response = await fetch(url, options)
		const result = await response.json()
		dateTransfer(result)
	} catch (error) {
		console.error(error)
		// dateTransfer(error)
	}
}

const dateTransfer = (data) => {
	if (!input.value || select.value == 0) {
		return
	} else if (data.success === false) {
		errorMsg(data)
	} else {
		textareaHTML(data)
		paragraph.textContent = ""
	}
}

const errorMsg = (data) => {
	const phrase = data.message
	paragraph.textContent = `${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}`
	paragraph.style.visibility = "visible"
	clearInputs()
}

const textareaHTML = (data) => {
	div = document.createElement("div")
	div.classList.add("note")
	div.classList.add("active")
	div.textContent = "Word: " + capitalLetter(data.word)

	if (selTxt.value == 1) {
		textarea.textContent = ""
		data.definitions.forEach((def) => {
			div.innerHTML += `                  
			<section>
			<span> Definitions:</span>        
			<span> ${def.definition}.</span>     
			<span> PartOfSpeech: ${def.partOfSpeech}</span>
			</section>           
			`
		})
	} else {
		textarea.textContent = ""
		div.innerHTML += `            
		<section>   
		<span> Synonyms: </span>
		<span> ${data.synonyms} </span>         
		</section>            
		`
	}

	textarea.append(div)
	synth.classList.add("anim")
	synthesizer()
}

const capitalLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

const enter = (e) => {
	if (e.key === "Enter") {
		typeSelect()
	}
}
console.log("synthesizer")

const synthesizer = () => {
	const voices = window.speechSynthesis.getVoices()

	synthSelect.innerHTML = voices
		.filter((v) => langsFilter(v))
		.map((voice) => {
			// console.log(voice)
			return `
		<option value="${voice.name}"> ${voice.name} </option>
		`
		})
}

const langsFilter = (v) => {
	const selectedLangs = ["en"]
	return selectedLangs.every((arrEl) => v.lang.includes(arrEl)) //czyli 'en'
}

const synthSpeak = () => {
	window.speechSynthesis.cancel()
	const txt = textarea.textContent
	const msg = new SpeechSynthesisUtterance()
	msg.text = txt
	msg.voice = window.speechSynthesis
		.getVoices()
		.find((v) => v.name === synthSelect.value)
	msg.volume = synthInput.value
	msg.rate = synthRate.value
	window.speechSynthesis.speak(msg)
	paragraph.textContent = ""
	clearInputs()
}

const synthStop = () => {
	// console.log(window.speechSynthesis)
	window.speechSynthesis.cancel()
	clearInputs()
	textarea > div.classList.remove("active") //lub textarea.textContent = ''
	textarea.textContent = ""
	paragraph.textContent = ""
	synth.classList.remove("anim")
}

const clearInputs = () => {
	input.value = ""
	select.value = 0
}
input.addEventListener("keydown", enter)
window.speechSynthesis.onvoiceschanged = synthesizer
synthBtnStop.onclick = synthStop
synthBtnSpeak.addEventListener("click", synthSpeak)

console.log("--------------------translator-----------------------")

// const url = 'https://deepl-translator.p.rapidapi.com/translate';
// const options = {
// 	method: 'POST',
// 	headers: {
// 		'content-type': 'application/json',
// 		'X-RapidAPI-Key': '9556836d5emsha94b903c8dce84ap1067fbjsn0931cfa53b42',
// 		'X-RapidAPI-Host': 'deepl-translator.p.rapidapi.com'
// 	},
// 	body: {
// 		text: 'cube',
// 		source: 'EN',
// 		target: 'PL'
// 	}
// };

// const deepl = async () => {
// 	try {
// 		const response = await fetch(url, options)
// 		const result = await response.json()
// 		console.log(result)
// 	} catch (error) {
// 		console.error(error)
// 	}
// }
// deepl()
