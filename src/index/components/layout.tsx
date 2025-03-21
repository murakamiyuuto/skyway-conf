import * as React from "react";
import { FunctionComponent, ReactNode } from "react";
import { css } from "@emotion/core";
import { globalColors, animation } from "../../shared/global-style";

interface Props {
  children: ReactNode;
}
const Layout: FunctionComponent<Props> = ({ children }: Props) => (
  <div css={wrapperStyle}>
    <h1 css={headStyle}>Randomcall</h1>
    <p css={pStyle}></p>

    <div css={contentStyle}>{children}</div>

    <p css={pStyle}>

    </p>
   
  </div>
);

export default Layout;

const wrapperStyle = css({
  backgroundImage: "url(./images/index/bg.jpg)",
  backgroundSize: "cover",
  animation: `${animation.moveBackground} 30s linear infinite alternate`,
  height: "100vh",
  position: "relative",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const contentStyle = css({
  width: "90%",
  maxWidth: 400,
  margin: "0 auto",
});

const headStyle = css({
  margin: 0,
  marginBottom: -8,
  color: globalColors.black,
  fontSize: "2.5rem",
});

const pStyle = css({
  margin: "16px auto",
  color: globalColors.white,
  fontSize: "1.2rem",
});

const logoStyle = css({
  position: "absolute",
  bottom: 10,
  right: 10,
  "& > img": {
    height: 40,
  },
});
