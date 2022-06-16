import SendIcon from '@mui/icons-material/Send';
import { Avatar } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Head from "next/head";
import {useState } from "react";
import styles from "./index.module.css";

function ChatBubbleComponent({ msg }) {
  return (<><div style={{
    width: "100%",
    // margin: "10px",
    display: "flex",
    flexDirection: msg.sender == 'Rob' ? "row" : "row-reverse"
  }}>
    <Avatar style={{
      margin: `${!(msg.sender == 'Rob') ? "0 0 0 10px" : "0 10px 0 0"}`
    }} src={(msg.sender == 'Rob') ? '/rob.png' : ""} ></Avatar>
    <div style={{
      border: '1px solid rgba(0, 0, 0, 0.12)',
      borderRadius: "10px",
      padding: "10px",
      maxWidth: "250px"
    }}> {msg.message} </div>
  </div></>);
}

export default function Home() {
  const [chatHistory, setChatHistory] = useState([
    { sender: "Rob", message: "Ciao Mariano! Come è andata oggi?" },
    // { sender: "Paolo", message: "Ciao Rob bene, ma è stata un po' stressante la giornata" },
    // { sender: "Rob", message: "Hai lavorato molto oggi, hai avuto 4 riuinioni su teams!" },
  ]);
  const [input, setInput] = useState('');
  const [fetching, setFetching] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (input.trim().length === 0) return;
    setFetching(true);
    const fetchPromise = fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatHistory: [...chatHistory, { sender: "Mariano", message: input }] }), //State change is async only doable like this
    });

    setChatHistory(hist => [...hist, { sender: "Mariano", message: input }]);
    setInput('');

    const response = await fetchPromise;
    const data = await response.json();
    setFetching(false);
    setChatHistory(hist => [...hist, { sender: "Rob", message: data.result }]);
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Mediolanum U</title>
      </Head>

      <main className={styles.main}>
        <h3>Mediolanum U - Chat with Rob</h3>
        <div style={{
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          width: "400px",
        }}>

          <div style={{
            display: "flex",
            flexDirection: 'column-reverse',
            gap: "20px",
            height: "450px",
            width: "100%",
            overflowY: "scroll",
            marginBottom: "20px"
          }}>
            {chatHistory.slice().reverse().map((msg, i) => { return <ChatBubbleComponent msg={msg} key={i} /> })}
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Manda un messaggio"
            value={input}
            onChange={(e) => setInput(e.target.value)}

          />
          <LoadingButton
            variant="contained"
            endIcon={<SendIcon />}
            onClick={onSubmit} disabled={!input || fetching}
            loading={fetching}
            loadingPosition="end"
          >
            Invia
          </LoadingButton>
        </form>
      </main>
    </>
  );
}
