import "./Coup.css";
import React, { useState, useEffect } from "react";
import ActionDecision from "../ActionDecision";
import ChallengeDecision from "../ChallengeDecision";
import BlockChallengeDecision from "../BlockChallengeDecision";
import PlayerBoard from "../PlayerBoard/PlayerBoard";
import RevealDecision from "../RevealDecision";
import BlockDecision from "../BlockDecision";
import ChooseInfluence from "../ChooseInfluence";
import ExchangeInfluences from "../ExchangeInfluences";
import EventLog from "../EventLog";
import CheatSheetModal from "../../CheatSheetModal";
import RulesModal from "../../RulesModal";

function Coup({ name, socket }) {
  const [state, setState] = useState({
    action: null,
    blockChallengeRes: null,
    players: [],
    playerIndex: null,
    currentPlayer: "",
    isChooseAction: false,
    revealingRes: null,
    blockingAction: null,
    isChoosingInfluence: false,
    exchangeInfluence: null,
    error: "",
    winner: "",
    playAgain: null,
    logs: [],
    isDead: false,
    waiting: true,
    disconnected: false,
  });

  useEffect(() => {
    const playAgainButton = (
      <>
        <br></br>
        <button
          className="startGameButton"
          onClick={() => socket.emit("g-playAgain")}
        >
          Play Again
        </button>
      </>
    );

    const handleDisconnect = () =>
      setState((prev) => ({ ...prev, disconnected: true }));
    const handleGameOver = (winner) => {
      setState((prev) => ({
        ...prev,
        winner: `${winner} Wins!`,
        playAgain: playAgainButton,
      }));
    };
    const handleUpdatePlayers = (players) => {
      players = players.filter((x) => !x.isDead);
      let playerIndex = null;
      for (let i = 0; i < players.length; i++) {
        if (players[i].name === name) {
          playerIndex = i;
          break;
        }
      }
      if (playerIndex == null) {
        setState((prev) => ({ ...prev, isDead: true }));
      } else {
        setState((prev) => ({ ...prev, isDead: false }));
      }
      setState((prev) => ({
        ...prev,
        playerIndex,
        players,
        playAgain: null,
        winner: null,
      }));
    };
    const handleUpdateCurrentPlayer = (currentPlayer) => {
      setState((prev) => ({ ...prev, currentPlayer }));
    };
    const handleAddLog = (log) => {
      let splitLog = log.split(" ");
      let coloredLog = splitLog.map((item, index) => {
        let found = null;
        state.players.forEach((player) => {
          if (item === player.name) {
            found = <b style={{ color: player.color }}>{player.name} </b>;
          }
        });
        if (found) {
          return found;
        }
        return <>{item + " "}</>;
      });
      setState((prev) => ({ ...prev, logs: [...prev.logs, coloredLog] }));
    };
    const handleChooseAction = () =>
      setState((prev) => ({ ...prev, isChooseAction: true }));
    const handleOpenExchange = (drawTwo) => {
      let influences = [
        ...state.players[state.playerIndex].influences,
        ...drawTwo,
      ];
      setState((prev) => ({ ...prev, exchangeInfluence: influences }));
    };
    const handleOpenChallenge = (action) => {
      if (state.isDead) {
        return;
      }
      if (action.source !== name) {
        setState((prev) => ({ ...prev, action }));
      } else {
        setState((prev) => ({ ...prev, action: null }));
      }
    };
    const handleOpenBlockChallenge = (blockChallengeRes) => {
      if (state.isDead) {
        return;
      }
      if (blockChallengeRes.counterAction.source !== name) {
        setState((prev) => ({ ...prev, blockChallengeRes }));
      } else {
        setState((prev) => ({ ...prev, blockChallengeRes: null }));
      }
    };
    const handleOpenBlock = (action) => {
      if (state.isDead) {
        return;
      }
      if (action.source !== name) {
        setState((prev) => ({ ...prev, blockingAction: action }));
      } else {
        setState((prev) => ({ ...prev, blockingAction: null }));
      }
    };
    const handleChooseReveal = (res) => {
      setState((prev) => ({ ...prev, revealingRes: res }));
    };
    const handleChooseInfluence = () =>
      setState((prev) => ({ ...prev, isChoosingInfluence: true }));
    const handleCloseChallenge = () =>
      setState((prev) => ({ ...prev, action: null }));
    const handleCloseBlock = () =>
      setState((prev) => ({ ...prev, blockingAction: null }));
    const handleCloseBlockChallenge = () =>
      setState((prev) => ({ ...prev, blockChallengeRes: null }));

    socket.on("disconnect", handleDisconnect);
    socket.on("g-gameOver", handleGameOver);
    socket.on("g-updatePlayers", handleUpdatePlayers);
    socket.on("g-updateCurrentPlayer", handleUpdateCurrentPlayer);
    socket.on("g-addLog", handleAddLog);
    socket.on("g-chooseAction", handleChooseAction);
    socket.on("g-openExchange", handleOpenExchange);
    socket.on("g-openChallenge", handleOpenChallenge);
    socket.on("g-openBlockChallenge", handleOpenBlockChallenge);
    socket.on("g-openBlock", handleOpenBlock);
    socket.on("g-chooseReveal", handleChooseReveal);
    socket.on("g-chooseInfluence", handleChooseInfluence);
    socket.on("g-closeChallenge", handleCloseChallenge);
    socket.on("g-closeBlock", handleCloseBlock);
    socket.on("g-closeBlockChallenge", handleCloseBlockChallenge);

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("g-gameOver", handleGameOver);
      socket.off("g-updatePlayers", handleUpdatePlayers);
      socket.off("g-updateCurrentPlayer", handleUpdateCurrentPlayer);
      socket.off("g-addLog", handleAddLog);
      socket.off("g-chooseAction", handleChooseAction);
      socket.off("g-openExchange", handleOpenExchange);
      socket.off("g-openChallenge", handleOpenChallenge);
      socket.off("g-openBlockChallenge", handleOpenBlockChallenge);
      socket.off("g-openBlock", handleOpenBlock);
      socket.off("g-chooseReveal", handleChooseReveal);
      socket.off("g-chooseInfluence", handleChooseInfluence);
      socket.off("g-closeChallenge", handleCloseChallenge);
      socket.off("g-closeBlock", handleCloseBlock);
      socket.off("g-closeBlockChallenge", handleCloseBlockChallenge);
    };
  }, [socket, name, state.isDead, state.players, state.playerIndex]);

  function deductCoins(amount) {
    let res = {
      source: name,
      amount: amount,
    };
    socket.emit("g-deductCoins", res);
  }

  function doneAction() {
    setState((prev) => ({ ...prev, isChooseAction: false }));
  }

  function doneChallengeBlockingVote() {
    setState((prev) => ({
      ...prev,
      action: null,
      blockChallengeRes: null,
      blockingAction: null,
    }));
  }

  function closeOtherVotes(voteType) {
    if (voteType === "challenge") {
      setState((prev) => ({
        ...prev,
        blockChallengeRes: null,
        blockingAction: null,
      }));
    } else if (voteType === "block") {
      setState((prev) => ({ ...prev, action: null, blockChallengeRes: null }));
    } else if (voteType === "challenge-block") {
      setState((prev) => ({ ...prev, action: null, blockingAction: null }));
    }
  }

  function doneReveal() {
    setState((prev) => ({ ...prev, revealingRes: null }));
  }

  function doneChooseInfluence() {
    setState((prev) => ({ ...prev, isChoosingInfluence: false }));
  }

  function doneExchangeInfluence() {
    setState((prev) => ({ ...prev, exchangeInfluence: null }));
  }

  function pass() {
    if (state.action != null) {
      let res = {
        isChallenging: false,
        action: state.action,
      };
      socket.emit("g-challengeDecision", res);
    } else if (state.blockChallengeRes != null) {
      let res = {
        isChallenging: false,
      };
      socket.emit("g-blockChallengeDecision", res);
    } else if (state.blockingAction !== null) {
      const res = {
        action: state.blockingAction,
        isBlocking: false,
      };
      socket.emit("g-blockDecision", res);
    }
    doneChallengeBlockingVote();
  }

  const influenceColorMap = {
    duke: "#D55DC7",
    captain: "#80C6E5",
    assassin: "#2B2B2B",
    contessa: "#E35646",
    ambassador: "#B4CA1F",
  };

  let actionDecision = null;
  let currentPlayer = null;
  let revealDecision = null;
  let challengeDecision = null;
  let blockChallengeDecision = null;
  let chooseInfluenceDecision = null;
  let blockDecision = null;
  let influences = null;
  let passButton = null;
  let coins = null;
  let exchangeInfluences = null;
  let playAgain = null;
  let isWaiting = true;
  let waiting = null;

  if (state.isChooseAction && state.playerIndex != null) {
    isWaiting = false;
    actionDecision = (
      <ActionDecision
        doneAction={doneAction}
        deductCoins={deductCoins}
        name={name}
        socket={socket}
        money={state.players[state.playerIndex].money}
        players={state.players}
      ></ActionDecision>
    );
  }
  if (state.currentPlayer) {
    currentPlayer = (
      <p>
        It is <b>{state.currentPlayer}</b>'s turn
      </p>
    );
  }
  if (state.revealingRes) {
    isWaiting = false;
    revealDecision = (
      <RevealDecision
        doneReveal={doneReveal}
        name={name}
        socket={socket}
        res={state.revealingRes}
        influences={state.players.filter((x) => x.name === name)[0].influences}
      ></RevealDecision>
    );
  }
  if (state.isChoosingInfluence) {
    isWaiting = false;
    chooseInfluenceDecision = (
      <ChooseInfluence
        doneChooseInfluence={doneChooseInfluence}
        name={name}
        socket={socket}
        influences={state.players.filter((x) => x.name === name)[0].influences}
      ></ChooseInfluence>
    );
  }
  if (
    state.action != null ||
    state.blockChallengeRes != null ||
    state.blockingAction !== null
  ) {
    passButton = <button onClick={() => pass()}>Pass</button>;
  }
  if (state.action != null) {
    isWaiting = false;
    challengeDecision = (
      <ChallengeDecision
        closeOtherVotes={closeOtherVotes}
        doneChallengeVote={doneChallengeBlockingVote}
        name={name}
        action={state.action}
        socket={socket}
      ></ChallengeDecision>
    );
  }
  if (state.exchangeInfluence) {
    isWaiting = false;
    exchangeInfluences = (
      <ExchangeInfluences
        doneExchangeInfluence={doneExchangeInfluence}
        name={name}
        influences={state.exchangeInfluence}
        socket={socket}
      ></ExchangeInfluences>
    );
  }
  if (state.blockChallengeRes != null) {
    isWaiting = false;
    blockChallengeDecision = (
      <BlockChallengeDecision
        closeOtherVotes={closeOtherVotes}
        doneBlockChallengeVote={doneChallengeBlockingVote}
        name={name}
        prevAction={state.blockChallengeRes.prevAction}
        counterAction={state.blockChallengeRes.counterAction}
        socket={socket}
      ></BlockChallengeDecision>
    );
  }
  if (state.blockingAction !== null) {
    isWaiting = false;
    blockDecision = (
      <BlockDecision
        closeOtherVotes={closeOtherVotes}
        doneBlockVote={doneChallengeBlockingVote}
        name={name}
        action={state.blockingAction}
        socket={socket}
      ></BlockDecision>
    );
  }
  if (state.playerIndex != null && !state.isDead) {
    influences = (
      <>
        <p>Your Influences</p>
        {state.players[state.playerIndex].influences.map((influence, index) => (
          <div key={index} className="InfluenceUnitContainer">
            <span
              className="circle"
              style={{ backgroundColor: `${influenceColorMap[influence]}` }}
            ></span>
            <br></br>
            <h3>{influence}</h3>
          </div>
        ))}
      </>
    );

    coins = <p>Coins: {state.players[state.playerIndex].money}</p>;
  }
  if (isWaiting && !state.isDead) {
    waiting = <p>Waiting for other players...</p>;
  }
  if (state.disconnected) {
    return (
      <div className="GameContainer">
        <div className="GameHeader">
          <div className="PlayerInfo">
            <p>You are: {name}</p>
            {coins}
          </div>
          <RulesModal />
          <CheatSheetModal />
        </div>
        <p>You have been disconnected :c</p>
        <p>Please recreate the game.</p>
        <p>Sorry for the inconvenience (シ_ _)シ</p>
      </div>
    );
  }
  return (
    <div className="GameContainer">
      <div className="GameHeader">
        <div className="PlayerInfo">
          <p>You are: {name}</p>
          {coins}
        </div>
        <div className="CurrentPlayer">{currentPlayer}</div>
        <RulesModal />
        <CheatSheetModal />
        <EventLog logs={state.logs}></EventLog>
      </div>
      <div className="InfluenceSection">{influences}</div>
      <PlayerBoard players={state.players}></PlayerBoard>
      <div className="DecisionsSection">
        {waiting}
        {revealDecision}
        {chooseInfluenceDecision}
        {actionDecision}
        {exchangeInfluences}
        {challengeDecision}
        {blockChallengeDecision}
        {blockDecision}
        {passButton}
        {playAgain}
      </div>
      <b>{state.winner}</b>
      {state.playAgain}
    </div>
  );
}

export default Coup;
