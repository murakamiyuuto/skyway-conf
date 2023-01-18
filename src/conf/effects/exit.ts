import debug from "debug";
const log = debug("effect:exit");

export const exitRoom = () => () => {
  log("exitRoom()");

  const yes = confirm("退出しますか？");
  if (!yes) {
    log("canceled");
    return;
  }

  location.href = 'https://wakaba-random-call.web.app/login/login_success.html';
};
