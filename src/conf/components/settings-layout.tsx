import * as React from "react";
import { FunctionComponent } from "react";
import { css } from "@emotion/core";
import { globalColors } from "../../shared/global-style";
import { VideoType, ClientBrowser } from "../utils/types";
import { modalContentWidth } from "../utils/style";
import Modal from "./modal";
import Video from "./video";
import { IconButton, Icon } from "./icon";
import { SettingsItemName, SettingsItemDevice } from "./settings-item";
import SettingsNameEdit from "./settings-name-edit";
import {
  SettingsDeviceSelector,
  SettingsDeviceToggler,
} from "./settings-device-selector";
import StreamController from "./stream-controller";

interface Props {
  stream: MediaStream;
  defaultDispName: string;
  browser: ClientBrowser;
  hasGetDisplayMedia: boolean;
  hasUserVideoDevice: boolean;
  videoType: VideoType;
  isVideoTrackMuted: boolean;
  isAudioTrackMuted: boolean;
  videoDeviceId: string;
  audioDeviceId: string;
  videoInDevices: MediaDeviceInfo[];
  audioInDevices: MediaDeviceInfo[];
  isReEntering: boolean;
  isJoined: boolean;
  isDisplayNameValid: boolean;
  onChangeVideoDeviceId: (deviceId: string) => void;
  onChangeAudioDeviceId: (deviceId: string) => void;
  onClickToggleVideoMuted: () => void;
  onClickToggleAudioMuted: () => void;
  onClickEnableUserVideo: () => void;
  onClickDisableUserVideo: () => void;
  onClickEnableDisplayVideo: () => void;
  onClickDisableDisplayVideo: () => void;
  onChangeDispName: (name: string) => void;
  onClickCloseSettings: () => void;
  onClickJoinConference: () => void;
}
const SettingsLayout: FunctionComponent<Props> = ({
  stream,
  defaultDispName,
  browser,
  hasGetDisplayMedia,
  hasUserVideoDevice,
  videoType,
  isVideoTrackMuted,
  isAudioTrackMuted,
  videoDeviceId,
  audioDeviceId,
  videoInDevices,
  audioInDevices,
  isReEntering,
  isJoined,
  isDisplayNameValid,
  onChangeVideoDeviceId,
  onChangeAudioDeviceId,
  onClickToggleVideoMuted,
  onClickToggleAudioMuted,
  onClickEnableUserVideo,
  onClickDisableUserVideo,
  onClickEnableDisplayVideo,
  onClickDisableDisplayVideo,
  onChangeDispName,
  onClickCloseSettings,
  onClickJoinConference,
}: Props) => (
  <Modal>
    <div css={wrapperStyle}>
      <div css={videoStyle}>
        <Video
          stream={stream}
          isReverse={videoType === "camera"}
          isVideoOnly={true}
        />
        <div css={controllerStyle}>
          <StreamController
            displayName={`v${browser.version}`}
            browser={browser}
            controllers={
              <>
                {videoType === null ? null : (
                  <IconButton
                    name={isVideoTrackMuted ? "videocam_off" : "videocam"}
                    title={isVideoTrackMuted ? "ビデオミュートを解除する" : "ビデオをミュートする"}
                    onClick={onClickToggleVideoMuted}
                  />
                )}
                <IconButton
                  name={isAudioTrackMuted ? "mic_off" : "mic"}
                  title={isAudioTrackMuted ? "ミュートを解除する" : "ミュートする"}
                  onClick={onClickToggleAudioMuted}
                />
              </>
            }
          />
        </div>
      </div>

      <div css={settingsStyle}>
        <SettingsItemName label="名前">
          <SettingsNameEdit
            defaultDispName={defaultDispName}
            isInvalid={!isDisplayNameValid}
            onChangeDispName={onChangeDispName}
          />
        </SettingsItemName>
        <SettingsItemDevice label="マイク">
          <SettingsDeviceToggler label="無効" disabled={true} />
          <SettingsDeviceSelector
            deviceId={audioDeviceId || ""}
            inDevices={audioInDevices}
            onChangeDeviceId={onChangeAudioDeviceId}
          />
        </SettingsItemDevice>
        {hasUserVideoDevice ? (
          <SettingsItemDevice label="カメラ">
            {videoType === "camera" ? (
              <>
                <SettingsDeviceToggler
                  label="無効"
                  onClick={onClickDisableUserVideo}
                />
                <SettingsDeviceSelector
                  deviceId={videoDeviceId || ""}
                  inDevices={videoInDevices}
                  onChangeDeviceId={onChangeVideoDeviceId}
                />
              </>
            ) : (
              <SettingsDeviceToggler
                label="有効"
                onClick={onClickEnableUserVideo}
              />
            )}
          </SettingsItemDevice>
        ) : null}
        {hasGetDisplayMedia ? (
          <SettingsItemDevice label="画面共有">
            {videoType === "display" ? (
              <>
                <SettingsDeviceToggler
                  label="無効"
                  onClick={onClickDisableDisplayVideo}
                />
                <SettingsDeviceToggler
                  label=" 共有画面の変更"
                  onClick={onClickEnableDisplayVideo}
                />
              </>
            ) : (
              <SettingsDeviceToggler
                label="有効"
                onClick={onClickEnableDisplayVideo}
              />
            )}
          </SettingsItemDevice>
        ) : null}
      </div>

      <div css={buttonWrapStyle}>
        <button
          css={doneButtonStyle}
          onClick={isJoined ? onClickCloseSettings : onClickJoinConference}
          disabled={isReEntering || !isDisplayNameValid}
        >
          {isReEntering ? (
            "再入室"
          ) : (
            <>
              <Icon name={isJoined ? "done" : "meeting_room"} />
              <span>{isJoined ? "設定を閉じる" : "入室する"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  </Modal>
);

export default SettingsLayout;

const wrapperStyle = css({
  width: modalContentWidth,
  margin: "32px auto 0",
  boxSizing: "border-box",
  backgroundColor: globalColors.white,
});

const videoStyle = css({
  position: "relative",
  width: "100%",
  height: (modalContentWidth / 4) * 3,
  backgroundColor: globalColors.black,
});

const controllerStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

const settingsStyle = css({
  margin: 16,
});

const buttonWrapStyle = css({
  padding: 16,
  textAlign: "center",
});

const doneButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: globalColors.orange,
  color: globalColors.white,
  height: 40,
  border: 0,
  cursor: "pointer",
  padding: "0 24px",
  fontSize: "1.2rem",
  borderRadius: 2,
  "&:disabled": {
    cursor: "not-allowed",
    backgroundColor: globalColors.gray,
  },
});
