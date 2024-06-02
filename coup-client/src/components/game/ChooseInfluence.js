import React from 'react';

function ChooseInfluence({ name, socket, doneChooseInfluence, influences }) {

    const selectInfluence = (influence) => {
        const res = {
            influence: influence,
            playerName: name
        };
        console.log(res);
        socket.emit('g-chooseInfluenceDecision', res);
        doneChooseInfluence();
    };

    const influenceButtons = influences.map((x, index) => (
        <button id={`${x}`} key={index} onClick={() => selectInfluence(x)}>
            {x}
        </button>
    ));

    return (
        <div>
            <p className="DecisionTitle">Choose an influence to lose</p>
            {influenceButtons}
        </div>
    );
};

export default ChooseInfluence;
