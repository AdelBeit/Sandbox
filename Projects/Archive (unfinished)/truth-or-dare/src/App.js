import React, { Component, useRef, useState, useEffect } from "react";
import TextBubble from "./Components/TextBubble";
import "./App.css";
import styled from "styled-components";
import Queue from "./Components/Queue";

const Chat = styled.div`
  margin: 0 auto;
  height: 80%;
  overflow-x: none;
  overflow-y: scroll;
  background-color: var(--palette-2);
  & * {
    overflow-anchor: none;
  }
`;

const StyledApp = styled.div`
  padding-top: 5vh;
  margin: 0 auto;
  width: 75vw;
  height: 80vh;
  button,
  input,
  > div {
    margin: 0 auto;
  }
`;

const Anchor = (props) => {
  const anchorRef = useRef(null);

  useEffect(() => {
    anchorRef.current.scrollIntoView();
  });

  return (
    <div
      ref={anchorRef}
      style={{
        height: "0.0000001px",
        overflowAnchor: "auto",
        backgroundColor: "red",
      }}
    ></div>
  );
};

function App() {
  const [message, setMessage] = useState("");
  const [chat, addToChat] = useState(
    new Queue([
      {
        source: "bot",
        text: "Truth or Dare",
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      },
      {
        source: "person",
        text: "whatup boys",
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      },
    ])
  );

  return (
    <StyledApp>
      <Chat>
        {chat.elements.map((element) => (
          <TextBubble key={Date.now() + Math.random()} element={element} />
        ))}
        <Anchor></Anchor>
      </Chat>

      <input
        placeholder="enter your message here"
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        value={message}
      />
      <button
        style={{ margin: "0 auto", display: "inline" }}
        type="button"
        onClick={() => {
          chat.enqueue({
            source: "person",
            text: message,
            time: `${new Date().getHours()}:${new Date().getMinutes()}`,
          });
          addToChat(new Queue([...chat.elements]));
          setMessage("");
        }}
      >
        Submit
      </button>
    </StyledApp>
  );
}

export default App;
