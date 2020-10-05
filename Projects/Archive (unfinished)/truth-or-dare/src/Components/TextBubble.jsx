import React from "react";
import styled from "styled-components";
import "../Globals.css";

const Text = styled.p`
  color: black;
  background-color: ${(props) =>
    props.source === "person"
      ? "var(--person-background)"
      : "var(--bot-background)"};
  max-width: 85%;
  width: auto;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
`;

const Time = styled(Text)`
  font-size: 0.5em;
  background-color: transparent;
`;

const StyledTextBubble = styled.div`
  font-size: 20px;
`;

const TextBubble = (props) => {
  const { source, text, time } = props.element;
  return (
    <StyledTextBubble>
      <Text source={source}>
        <span
          style={{
            display: "inline-block",
            height: "60px",
          }}
        >
          {text}
        </span>
      </Text>
      <Time>{time}</Time>
    </StyledTextBubble>
  );
};

export default TextBubble;
