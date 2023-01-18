
import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { FunctionComponent } from "react";
import { css } from "@emotion/core";
import { globalColors } from "../../shared/global-style";
import { RoomChat } from "../utils/types";
import { modalContentWidth } from "../utils/style";
import Modal from "./modal";
import { IconButton } from "./icon";
import ChatMessage from "./chat-message";

interface Props {
  chats: RoomChat[];
  onClickSend: (text: string) => void;
  onClickCloser: () => void;
}
   
    


const ChatLayout: FunctionComponent<Props> = ({
  
  chats,
  onClickCloser,
  onClickSend,
}: Props) => {
  const [text1, setText] = useState<string> ("");
  const onSend = useCallback(() => {
    onClickSend(text1);
    setText("");
  }, [text1, onClickSend]);

  
 
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollerRef.current === null) {
      return;
    }
    //お題を生成 
    
    var options = ["システムメッセージ! お題【好きなゲーム】","システムメッセージ！お題【好きな漫画】", "システムメッセージ！お題【好きなアニメ】", "システムメッセージ！お題【最近見た動画】", "システムメッセージ！お題【好きなアーティスト】",];
    var randomOption = options[Math.floor(Math.random() * options.length)];
  


    const inputField = document.getElementById("inputField") as HTMLInputElement;
    const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
    
    submitButton.addEventListener("click", () => {
      setText(randomOption);
      inputField.value = randomOption;
      
  
      
      
    });

    const $scroller = scrollerRef.current;
    $scroller.scrollTo({ top: $scroller.scrollHeight, behavior: "smooth" });
  }, [chats, scrollerRef]);

  return (
    <Modal>
      <div css={wrapperStyle}>
        <div css={headStyle}>
          <IconButton name="close" onClick={onClickCloser} />
        </div>
        <div css={scrollerStyle} ref={scrollerRef}>
          {chats.map((chat) => (
            <ChatMessage key={chat.id} chat={chat} />
          ))}
        </div>
        <div css={editorStyle}>
          <input
            type="text"
            id="inputField"
            value={text1}
            
            onChange={(ev) => setText (ev.target.value)}
            css={inputStyle}
          />
          
          

          
         
          
              

          <IconButton
            name="send"
           
            onClick={onSend}
          />
          
          <button id="submitButton" onClick={onSend}>お題生成</button>
          
        </div>
        
      </div>
      
    </Modal>
  );
  
};

export default ChatLayout;

const wrapperStyle = css({
  display: "grid",
  gridTemplateRows: "20px 1fr 20px",
  width: modalContentWidth,
  height: "80%",
  boxSizing: "border-box",
  margin: "32px auto 0",
  padding: 8,
  backgroundColor: globalColors.white,
});

const headStyle = css({
  textAlign: "right",
});

const scrollerStyle = css({
  overflowY: "scroll",
  overflowScrolling: "touch",
});

const editorStyle = css({
  display: "flex",
  alignItems: "center",
});

const inputStyle = css({
  flex: "1 1 auto",
  marginRight: 8,
});
