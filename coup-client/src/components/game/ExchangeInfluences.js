import React, { useState } from 'react';

function ExchangeInfluences({ name, influences, socket, doneExchangeInfluence }) {
    const [keep, setKeep] = useState([]);
    const [totalInf] = useState(influences.length);

    const selectInfluence = (index) => {
        const updatedInfluences = [...influences];
        const selectedInfluence = updatedInfluences.splice(index, 1)[0];
        setKeep(prevKeep => [...prevKeep, selectedInfluence]);

        if (keep.length === (totalInf - 2)) {
            const res = {
                playerName: name,
                kept: keep,
                putBack: updatedInfluences
            };
            socket.emit('g-chooseExchangeDecision', res);
            doneExchangeInfluence();
        }
    };

    const influenceButtons = influences.map((influence, index) => (
        <button key={index} onClick={() => selectInfluence(index)}>{influence}</button>
    ));

    return (
        <div>
            <p className="DecisionTitle">Choose which influence(s) to keep</p>
            {influenceButtons}
        </div>
    );
}

export default ExchangeInfluences;
