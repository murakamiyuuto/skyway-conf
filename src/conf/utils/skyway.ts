import Peer, { SfuRoom } from "skyway-js";

export const initPeer = (forceTurn: boolean): Promise<Peer> => {
  return new Promise((resolve, reject) => {
    const peer = new Peer({
      key: "48a7b8bf-7974-4b26-9233-08a8f458cb2a",
      debug: 2,
      config: {
        iceTransportPolicy: forceTurn ? "relay" : "all",
      },
    });

    peer.once("open", () => {
      peer.removeListener("error", reject);
      resolve(peer);
    });
    // for onOpen error
    peer.once("error", reject);
  });
};

export const getPeerConnectionFromSfuRoom = (
  room: SfuRoom
): RTCPeerConnection => {
  // @ts-ignore: to get private refs
  return room._negotiator._pc;
};
