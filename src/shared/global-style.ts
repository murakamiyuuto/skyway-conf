import { css, keyframes } from "@emotion/core";

export const fontSize = 20;

export const globalColors = {
  blue: "#005ece",
  lightblue: "#039be5",
  red: "#ff6673",
  gray: "#eee",
  white: "#fff",
  black: "#111",
  orange: "#ef6c35"
};

export const animation = {
  moveBackground: keyframes`
      0% { background-position: top left; }
    100% { background-position: top right; }
  `,
};

export const globalStyle = css({
  html: {
    WebkitFontSmoothing: "antialiased",
  },
  body: {
    margin: 0,
    fontSize,
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: "lighter",
    lineHeight: 1.5,
    height: "100vh",
    background: `linear-gradient(45deg, ${globalColors.orange}, ${globalColors.orange})`,
  },
  "#app-root": {
    height: "100vh",
    overflow: "hidden",
  },
});
