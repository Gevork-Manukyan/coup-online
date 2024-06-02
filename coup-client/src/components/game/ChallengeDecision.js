import React from 'react';

const ChallengeDecision = ({ action, name, socket, doneChallengeVote, closeOtherVotes }) => {

    const vote = (isChallenging) => {
        closeOtherVotes('challenge');

        const res = {
            action: action,
            isChallenging,
            challengee: action.source,
            challenger: name
        };
        console.log(res);
        socket.emit('g-challengeDecision', res);
        doneChallengeVote();
    };

    const challengeText = (action, source, target) => {
        if(action === 'steal') {
            return <p><b>{source}</b> is trying to Steal from <b>{target}</b></p>;
        } else if(action === 'tax') {
            return <p><b>{source}</b> is trying to collect Tax (3 coins)</p>;
        } else if(action === 'assassinate') {
            return <p><b>{source}</b> is trying to Assassinate <b>{target}</b></p>;
        } else if(action === 'exchange') {
            return <p><b>{source}</b> is trying to Exchange their influences</p>;
        }
    };

    return (
        <>
            {challengeText(action.action, action.source, action.target)}
            <button onClick={() => vote(true)}>Challenge</button>
            {/* <button onClick={() => vote(false)}>Pass</button> */}
        </>
    );
};

export default ChallengeDecision;
