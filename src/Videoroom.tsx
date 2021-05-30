import * as React from "react";

export class Videoroom extends React.Component {
  videoElRef = React.createRef<HTMLVideoElement>();
  peerConnection: RTCPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
      {
        urls: "stun:stun2.l.google.com:19302",
      },
      {
        urls: "stun:stun3.l.google.com:19302",
      },
      {
        urls: "stun:stun4.l.google.com:19302",
      },
    ],
  });

  componentDidMount() {
    const socket = new WebSocket("ws://localhost:8000");

    socket.onopen = () => {
      console.log("opened");

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: event.candidate,
            })
          );
        }
      };

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            aspectRatio: 4 / 3,
          },
        })
        .then((localStream) => {
          localStream
            .getTracks()
            .forEach((track) =>
              this.peerConnection.addTrack(track, localStream)
            );

          this.peerConnection
            .createOffer()
            .then((offer) => {
              return this.peerConnection.setLocalDescription(offer);
            })
            .then(() => {
              socket.send(
                JSON.stringify({
                  type: "sdpOffer",
                  sdp: this.peerConnection.localDescription!.sdp,
                })
              );
            });
        });

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "sdpAnswer": {
            this.peerConnection.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp: message.sdp })
            );
            this.peerConnection.ontrack = (event) => {
              if (this.videoElRef.current) {
                this.videoElRef.current.srcObject = event.streams[0]!;
              }
            };
          }
          case "iceCandidate": {
            this.peerConnection.addIceCandidate(message.candidate);
          }
        }
      };
    };
  }

  componentWillUnmount() {
    this.peerConnection.close();
  }

  render() {
    return (
      <div>
        <span>Home</span>
        <video ref={this.videoElRef} autoPlay={true}></video>
      </div>
    );
  }
}
