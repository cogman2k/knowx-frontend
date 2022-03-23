
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Meeting = (props) => {
  const history = useHistory();
  const domain = "meet.jit.si";
  let api = {};

  const startMeet = () => {
    const options = {
      roomName: props.room,
      width: "100%",
      height: 700,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector("#jitsi-iframe"),
      userInfo: {
        displayName: props.userName,
      },
    };

    api = new window.JitsiMeetExternalAPI(domain, options);

    api.executeCommand("avatarUrl", props.imageUrl);

    api.addEventListeners({
      videoConferenceLeft: handleVideoConferenceLeft,
      participantLeft: handleParticipantLeft,
    });
  };

  const handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
  };

  const handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    return history.push("/homepage");
  };

  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
  }, []);

  return <div id="jitsi-iframe" />;
};

export default Meeting;
