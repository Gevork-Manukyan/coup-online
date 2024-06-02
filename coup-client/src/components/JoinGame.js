import React, { useState } from "react";
import io from "socket.io-client";
import Coup from "./Game/Coup/Coup";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

function JoinGame() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [socket, setSocket] = useState(null);

  function onNameChange(name) {
    setName(name);
  }

  function onCodeChange(roomCode) {
    setRoomCode(roomCode);
  }

  function joinParty() {
    const socket = io(`${baseUrl}/${roomCode}`);
    setSocket(socket);
    console.log("socket created");
    socket.emit("setName", name);

    socket.on("joinSuccess", function () {
      console.log("join successful");
      setIsInRoom(true);
    });

    socket.on("joinFailed", function (err) {
      console.log("join failed, cause: " + err);
      setErrorMsg(err);
      setIsError(true);
      setIsLoading(false);
      socket.disconnect();
    });

    socket.on("startGame", () => {
      setIsGameStarted(true);
    });

    socket.on("partyUpdate", (players) => {
      console.log(players);
      setPlayers(players);
    });

    socket.on("disconnected", function () {
      console.log("You've lost connection with the server");
    });
  }

  function attemptJoinParty() {
    if (name === "") {
      console.log("Please enter a name");
      setErrorMsg("Please enter a name");
      setIsError(true);
      return;
    }
    if (roomCode === "") {
      console.log("Please enter a room code");
      setErrorMsg("Please enter a room code");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    axios
      .get(`${baseUrl}/exists/${roomCode}`)
      .then(function (res) {
        console.log(res);
        if (res.data.exists) {
          console.log("joining");
          setErrorMsg("");
          joinParty();
        } else {
          console.log("Invalid Party Code");
          setErrorMsg("Invalid Party Code");
          setIsError(true);
          setIsLoading(false);
        }
      })
      .catch(function (err) {
        console.log("error in getting exists", err);
        setErrorMsg("Server error");
        setIsError(true);
        setIsLoading(false);
      });
  }

  function reportReady() {
    socket.emit("setReady", true);
    socket.on("readyConfirm", () => {
      setIsReady(true);
    });
  }

  if (isGameStarted) {
    return <Coup name={name} socket={socket}></Coup>;
  }

  let error = null;
  let joinReady = null;
  let ready = null;
  if (isError) {
    error = <b>{errorMsg}</b>;
  }
  if (isInRoom) {
    joinReady = (
      <button className="joinButton" onClick={reportReady} disabled={isReady}>
        Ready
      </button>
    );
  } else {
    joinReady = (
      <button
        className="joinButton"
        onClick={attemptJoinParty}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join"}
      </button>
    );
  }
  if (isReady) {
    ready = <b style={{ color: "#5FC15F" }}>You are ready!</b>;
    joinReady = null;
  }

  return (
    <div className="joinGameContainer">
      <p>Your Name</p>
      <input
        type="text"
        value={name}
        disabled={isLoading}
        onChange={(e) => {
          if (e.target.value.length <= 8) {
            setErrorMsg("");
            setIsError(false);
            onNameChange(e.target.value);
          } else {
            setErrorMsg("Name must be less than 9 characters");
            setIsError(true);
          }
        }}
      />
      <p>Room Code</p>
      <input
        type="text"
        value={roomCode}
        disabled={isLoading}
        onChange={(e) => onCodeChange(e.target.value)}
      />
      <br></br>
      {joinReady}
      <br></br>
      {ready}
      <br></br>
      {error}
      <div className="readyUnitContainer">
        {players.map((item, index) => {
          let ready = null;
          let readyUnitColor = "#E46258";
          if (item.isReady) {
            ready = <b>Ready!</b>;
            readyUnitColor = "#73C373";
          } else {
            ready = <b>Not Ready</b>;
          }
          return (
            <div
              className="readyUnit"
              style={{ backgroundColor: readyUnitColor }}
              key={index}
            >
              <p>
                {index + 1}. {item.name} {ready}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JoinGame;
