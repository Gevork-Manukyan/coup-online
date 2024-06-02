import React from 'react';

function RevealDecision({ res, influences, socket, doneReveal }) {
    const act = res.isBlock ? res.counterAction.counterAction : res.action.action;
    const actionMap = {
        tax: ["duke"],
        assassinate: ["assassin"],
        exchange: ["ambassador"],
        steal: ["captain"],
        block_foreign_aid: ["duke"],
        block_steal: ["ambassador", "captain"],
        block_assassinate: ["contessa"],
    };

    const selectInfluence = (influence) => {
        const revealRes = {
            revealedCard: influence,
            prevAction: res.action,
            counterAction: res.counterAction,
            challengee: res.challengee,
            challenger: res.challenger,
            isBlock: res.isBlock
        };
        socket.emit('g-revealDecision', revealRes);
        doneReveal();
    };

    const influenceButtons = influences.map((influence, index) => (
        <button id={influence} key={index} onClick={() => selectInfluence(influence)}>{influence}</button>
    ));

    return (
        <div>
            <p>Your <b>{act}</b> has been challenged! If you don't reveal {actionMap[act].join(' or ')} you'll lose influence! </p>
            {influenceButtons}
        </div>
    );
}

export default RevealDecision;
