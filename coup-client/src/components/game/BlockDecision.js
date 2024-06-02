import React, { useState } from 'react';

const BlockDecision = ({ name, socket, doneAction, closeOtherVotes, action, doneBlockVote }) => {
    const [isDecisionMade, setIsDecisionMade] = useState(false);
    const [decision, setDecision] = useState('');
    const [isPickingClaim, setIsPickingClaim] = useState(false);

    const chooseAction = (action, target = null) => {
        const res = {
            action: {
                action: action,
                target: target,
                source: name
            }
        };
        console.log(res);
        
        socket.emit('g-actionDecision', res);
        doneAction();
    };

    const block = (block, claim = null) => {
        closeOtherVotes('block');

        let resClaim;
        if (claim != null) {
            resClaim = claim;
        } else if (block === 'block_foreign_aid') {
            resClaim = 'duke';
        } else if (block === 'block_assassinate') {
            resClaim = 'contessa';
        } else {
            console.error('unknown claim, line 40');
        }

        const res = {
            prevAction: action,
            counterAction: {
                counterAction: block,
                claim: resClaim,
                source: name
            },
            blockee: action.source,
            blocker: name,
            isBlocking: true
        };
        console.log(res);
        socket.emit('g-blockDecision', res);
        doneBlockVote();
    };

    const pass = () => {
        const res = {
            action: action,
            isBlocking: false
        };
        console.log(res);
        socket.emit('g-blockDecision', res);
        doneBlockVote();
    };

    const pickClaim = (block) => {
        closeOtherVotes('block');
        setDecision(block);
        setIsPickingClaim(true);
    };

    let control = null;
    let pickClaimContent = null;

    if (!isPickingClaim) {
        if (action.action === 'foreign_aid') {
            control = (
                <>
                    <p><b>{action.source}</b> is trying to use Foreign Aid</p>
                    <button onClick={() => block('block_foreign_aid')}>Block Foreign Aid</button>
                </>
            );
        } else if (action.action === 'steal') {
            control = <button onClick={() => pickClaim('block_steal')}>Block Steal</button>;
        } else if (action.action === 'assassinate') {
            control = <button onClick={() => block('block_assassinate')}>Block Assassination</button>;
        }
    } else {
        pickClaimContent = (
            <>
                <p>To block steal, do you claim Ambassador or Captain?</p>
                <button onClick={() => block(decision, 'ambassador')}>Ambassador</button>
                <button onClick={() => block(decision, 'captain')}>Captain</button>
            </>
        );
    }
    
    return (
        <>
            {control}
            {pickClaimContent}
            {/* <button onClick={() => pass()}>Pass</button> */}
        </>
    );
};

export default BlockDecision;
