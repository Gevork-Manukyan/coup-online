import React from 'react';

function BlockChallengeDecision({ counterAction, prevAction, closeOtherVotes, socket, doneBlockChallengeVote, name }) {

    const vote = (isChallenging) => {
        closeOtherVotes('challenge-block');

        const res = {
            counterAction,
            prevAction,
            isChallenging,
            challengee: counterAction.source,
            challenger: name
        };
        console.log(res);
        socket.emit('g-blockChallengeDecision', res);
        doneBlockChallengeVote();
    };

    return (
        <>
            <p>{counterAction.source} is trying to block {prevAction.action} from {prevAction.source} as {counterAction.claim}</p>
            <button onClick={() => vote(true)}>Challenge</button>
            {/* <button onClick={() => vote(false)}>Pass</button> */}
        </>
    );
};

export default BlockChallengeDecision;
