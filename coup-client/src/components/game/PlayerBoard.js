import React from 'react';
import './PlayerBoardStyles.css';

function PlayerBoard({ players }) {
    let boardItems = null;

    if (players.length > 1) {
        boardItems = players.map((player, index) => (
            <span className="PlayerBoardItem" style={{ backgroundColor: `${player.color}` }} key={index}>
                <h2>{player.name}</h2>
                <p>Coins: {player.money}</p>
                <p>Influences: {player.influences.length}</p>
                {/* <p>{player.influences.join(', ')}</p> */}
            </span>
        ));
    }

    return (
        <div className="PlayerBoardContainer" style={{ textAlign: "center" }}>
            {boardItems}
        </div>
    );
}

export default PlayerBoard;
