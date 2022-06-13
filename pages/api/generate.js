import { Configuration, OpenAIApi } from "openai";
// import data from "../public/data";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.log(generatePrompt(req.body.chatHistory))
  const completion = await openai.createCompletion("text-davinci-002", {
    prompt: generatePrompt(req.body.chatHistory),
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
  });
  res.status(200).json({ result: completion.data.choices[0].text, data:completion.data });
}


function generatePrompt(hist) {
  const preamble = `Questa è una conversazione con Rob l'assistente virtuale di Mediolanum, una banca in Italia, la sua funzione principale è aiutare i dipendenti della banca a migliorare il loro wellbeing, suggerendo utili consigli sia lato fisico, sia mentale. I dipendenti possono lavorare o nel campus di Basiglio quindi partecipare agli eventi di quel giorno o lavorare in remoto.`
  const info = `Impiegato Paolo:
Attività Odierne{Lavoro in remoto, 5 riunioni online, 4000 passi, 1 ora di postura scorretta}
Attività di domani{Lavoro in campus, 3 riunioni online, 5 di presenza}

Eventi al campus Basiglio:
-Mozzarella party, domani alle 17:00
-Aperitivo, domani alle 18:00
Eventi disponibili online: 
-Postural training
-Classe di meditazione
-Classe di yoga
Servizi in campus:
-Psicologo
-Ristorante
`
  return `${preamble} ${info}
${hist.slice(-8).map((h)=>{return `${h.sender}: ${h.message}`}).join("\n")}
Rob: `
}



