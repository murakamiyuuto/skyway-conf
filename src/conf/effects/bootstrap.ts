import { EffectCallback } from "react";
import { toJS, reaction, observe } from "mobx";
import debug from "debug";
import {
  isValidRoomId,
  isValidRoomType,
  roomIdRe,
} from "../../shared/validate";
import { getUserDevices, getUserAudioTrack } from "../utils/webrtc";
import { initPeer } from "../utils/skyway";
import { RoomInit } from "../utils/types";
import RootStore from "../stores";

const log = debug("effect:bootstrap");

export const checkRoomSetting = ({
  ui,
  room,
}: RootStore): EffectCallback => () => {
  log("checkRoomSetting()");
  const [, roomType, roomId] = location.hash.split("/");
  const params = new URLSearchParams(location.search);

  if (!isValidRoomType(roomType)) {
    throw ui.showError(
      new Error("認証エラー！最初からやり直してください")
    );
  }
  if (!isValidRoomId(roomId)) {
    throw ui.showError(
      new Error(
        `Invalid room name! it should be match \`${roomIdRe.toString()}\`.`
      )
    );
  }

  (async () => {
    const peer = await initPeer(params.has("turn")).catch((err) => {
      throw ui.showError(err);
    });
    // just log it, do not trust them
    peer.on("error", console.error);
    room.load(
      {
        mode: roomType as RoomInit["mode"],
        id: roomId,
        useH264: params.has("h264"),
      },
      peer
    );

    log(`room: ${roomType}/${roomId}`);
    log("peer instance created");
  })();
};

export const initAudioDeviceAndClient = ({
  ui,
  client,
  media,
}: RootStore): EffectCallback => () => {
  log("ensureAudioDevice()");

  (async () => {
    // check at least audio input exists
    const { videoInDevices, audioInDevices } = await getUserDevices({
      video: true,
      audio: true,
    }).catch((err) => {
      throw ui.showError(err);
    });

    // must not be happened
    if (videoInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }
    if (audioInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }
    if (audioInDevices.length === 0) {
      throw ui.showError(new Error("オーディオデバイスを接続してください"));
    }

    log(
      "%s audio + %s video builtin devices are found",
      audioInDevices.length,
      videoInDevices.length
    );

    // keep audio track
    const [{ deviceId }] = audioInDevices;
    const audioTrack = await getUserAudioTrack(deviceId).catch((err) => {
      throw ui.showError(err);
    });
    media.setAudioTrack(audioTrack, deviceId);

    // and get valid labels...
    const devices = await getUserDevices({ audio: true }).catch((err) => {
      throw ui.showError(err);
    });
    media.setAudioDevices(devices);
    log("audio devices", devices.audioInDevices);

    // load client
    client.load({
      ua: navigator.userAgent,
      hasUserVideoDevice: videoInDevices.length !== 0,
      hasGetDisplayMedia:
        typeof navigator.mediaDevices.getDisplayMedia === "function",
      name: (localStorage.getItem("SkyWayConf.dispName") || "").trim(),
    });
    log("client loaded", toJS(client));
  })();
};

export const listenStoreChanges = ({
  client,
  media,
  room,
  notification,
}: RootStore): EffectCallback => () => {
  log("listenStoreChanges()");

  const disposers = [
    reaction(
      () => room.isJoined,
      (isJoined) =>
        isJoined && notification.showInfo(`入室しました ${room.name}`)
    ),
    reaction(
      () => media.isAudioTrackMuted,
      (muted) =>
        notification.showInfo(`マイクを ${muted ? "ミュートしました" : "ミュート解除しました"}`)
    ),
    reaction(
      () => media.isVideoTrackMuted,
      (muted) =>
        notification.showInfo(`ビデオを ${muted ? "ミュートしました" : "ミュート解除しました"}`)
    ),
    observe(media, "audioDeviceId", (change) => {
      if (change.oldValue === null) {
        // skip initial value
        return;
      }
      notification.showInfo("マイクを変更しました");
    }),
    observe(media, "videoDeviceId", (change) => {
      if (change.oldValue === null) {
        notification.showInfo(" カメラを有効にしました");
        return;
      }
      if (change.newValue !== null) {
        notification.showInfo("カメラを変更しました");
      } else {
        notification.showInfo("カメラを無効にしました");
      }
    }),
    reaction(
      () => room.castRequestCount,
      () => notification.showInfo("")
    ),
    reaction(
      () => room.myLastReaction,
      (reaction) =>
        reaction &&
        notification.showInfo(` ${reaction.reaction}`)
    ),
    reaction(
      () => client.displayName,
      (name) => {
        localStorage.setItem("SkyWayConf.dispName", name.trim());
        notification.showInfo("名前を保存しました");
      },
      { delay: 2000 }
    ),
  ];

  return () => disposers.forEach((d) => d());
};

export const listenGlobalEvents = ({
  media,
  ui,
}: RootStore): EffectCallback => () => {
  log("listenGlobalEvents()");

  const reloadOnHashChange = () => location.reload(true);
  const reloadOnDeviceAddOrRemoved = async () => {
    log("devicechange event fired");
    const { audioInDevices, videoInDevices } = await getUserDevices({
      video: true,
      audio: true,
    }).catch((err) => {
      throw ui.showError(err);
    });

    // must not be happened
    if (audioInDevices === null || videoInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }

    const curAudioInDevices = media.audioInDevices;
    const curVideoInDevices = media.videoInDevices;

    // Safari fires this event on updating label(num of devices are not changed)
    if (
      curAudioInDevices.length &&
      audioInDevices.length !== curAudioInDevices.length
    ) {
      location.reload(true);
    }
    if (
      curVideoInDevices.length &&
      videoInDevices.length !== curVideoInDevices.length
    ) {
      location.reload(true);
    }
  };

  window.addEventListener("hashchange", reloadOnHashChange, false);
  navigator.mediaDevices.addEventListener(
    "devicechange",
    reloadOnDeviceAddOrRemoved,
    false
  );

  return () => {
    log("listener removed");
    window.removeEventListener("hashchange", reloadOnHashChange);
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      reloadOnDeviceAddOrRemoved
    );
  };
};
