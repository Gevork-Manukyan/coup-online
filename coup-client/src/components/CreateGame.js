import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { ReactSortable } from "react-sortablejs";
import Coup from "./Game/Coup/Coup";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function CreateGame(props) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [canStart, setCanStart] = useState(false);
  const [socket, setSocket] = useState(null);

  const onNameChange = (name) => {
    setName(name);
  };

  const joinParty = () => {
    const socket = io(`${baseUrl}/${roomCode}`);
    setSocket(socket);
    console.log("socket created");
    socket.emit("setName", name);

    socket.on("joinSuccess", () => {
      console.log("join successful");
      setIsLoading(false);
      setIsInRoom(true);
    });

    socket.on("joinFailed", (err) => {
      console.log("join failed, cause: " + err);
      setIsLoading(false);
    });

    socket.on("leader", () => {
      console.log("You are the leader");
    });

    socket.on("partyUpdate", (players) => {
      console.log(players);
      setPlayers(players);
      if (
        players.length >= 2 &&
        players.map((x) => x.isReady).filter((x) => x === true).length ===
          players.length
      ) {
        setCanStart(true);
      } else {
        setCanStart(false);
      }
    });

    socket.on("disconnected", () => {
      console.log("You've lost connection with the server");
    });
  };

  const createParty = () => {
    if (name === "") {
      console.log("Please enter a name");
      setErrorMsg("Please enter a name");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${baseUrl}/createNamespace`)
      .then((res) => {
        console.log(res);
        setRoomCode(res.data.namespace);
        setErrorMsg("");
        joinParty();
      })
      .catch((err) => {
        console.log("error in creating namespace", err);
        setIsLoading(false);
        setErrorMsg("Error creating room, server is unreachable");
        setIsError(true);
      });
  };

  const startGame = () => {
    socket.emit("startGameSignal", players);

    socket.on("startGame", () => {
      setIsGameStarted(true);
    });
  };

  const copyCode = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = roomCode;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopied(true);
  };

  if (isGameStarted) {
    return <Coup name={name} socket={socket} />;
  }

  let error = null;
  let roomCodeDisplay = null;
  let startGameButton = null;
  let createButton = null;
  let youCanSort = null;
  if (!isInRoom) {
    createButton = (
      <>
        <button
          className="createButton"
          onClick={createParty}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
        <br></br>
      </>
    );
  }
  if (isError) {
    error = <b>{errorMsg}</b>;
  }
  if (roomCode !== "" && !isLoading) {
    youCanSort = (
      <p>You can drag to re-arrange the players in a specific turn order!</p>
    );
    roomCodeDisplay = (
      <div>
        <p>
          ROOM CODE: <br></br> <br></br>
          <b className="RoomCode" onClick={copyCode}>
            {roomCode}{" "}
            <span
              className="iconify"
              data-icon="typcn-clipboard"
              data-inline="true"
            ></span>
          </b>
        </p>
        {copied ? <p>Copied to clipboard</p> : null}
      </div>
    );
  }
  if (canStart) {
    startGameButton = (
      <button className="startGameButton" onClick={startGame}>
        Start Game
      </button>
    );
  }
  return (
    <div className="createGameContainer">
      <p>Please enter your name</p>
      <input
        type="text"
        value={name}
        disabled={isLoading || isInRoom}
        onChange={(e) => {
          if (e.target.value.length <= 10) {
            setErrorMsg("");
            setIsError(false);
            onNameChange(e.target.value);
          } else {
            setErrorMsg("Name must be less than 11 characters");
            setIsError(true);
          }
        }}
      />
      <br></br>
      {createButton}
      {error}
      <br></br>
      {roomCodeDisplay}
      {youCanSort}
      <div className="readyUnitContainer">
        <ReactSortable
          list={players}
          setList={(newState) => setPlayers(newState)}
        >
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
        </ReactSortable>
      </div>

      {startGameButton}
    </div>
  );
}
