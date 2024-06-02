import React, { useState } from 'react';

function ActionDecision({ name, socket, doneAction, money, deductCoins, players }) {
    const [isDecisionMade, setIsDecisionMade] = useState(false);
    const [decision, setDecision] = useState('');
    const [isPickingTarget, setIsPickingTarget] = useState(false);
    const [targetAction, setTargetAction] = useState('');
    const [actionError, setActionError] = useState('');

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

    const deductCoinsAndPickTarget = (action) => {
        console.log(money, action);
        if (action === 'assassinate') {
            if (money >= 3) {
                deductCoins(3);
                pickingTarget('assassinate');
            } else {
                setActionError('Not enough coins to assassinate!');
            }
        } else if (action === 'coup') {
            if (money >= 7) {
                deductCoins(7);
                pickingTarget('coup');
            } else {
                setActionError('Not enough coins to coup!');
            }
        }
    };

    const pickingTarget = (action) => {
        setIsPickingTarget(true);
        setTargetAction(action);
        setActionError('');
    };

    const pickTarget = (target) => {
        chooseAction(targetAction, target);
    };

    let controls = null;
    if (isPickingTarget) {
        controls = players
            .filter(x => !x.isDead)
            .filter(x => x.name !== name)
            .map((x, index) => (
                <button style={{ backgroundColor: x.color }} key={index} onClick={() => pickTarget(x.name)}>
                    {x.name}
                </button>
            ));
    } else if (money < 10) {
        controls = (
            <>
                <button onClick={() => chooseAction('income')}>Income</button>
                <button onClick={() => deductCoinsAndPickTarget('coup')}>Coup</button>
                <button onClick={() => chooseAction('foreign_aid')}>Foreign Aid</button>
                <button id="captain" onClick={() => pickingTarget('steal')}>Steal</button>
                <button id="assassin" onClick={() => deductCoinsAndPickTarget('assassinate')}>Assassinate</button>
                <button id="duke" onClick={() => chooseAction('tax')}>Tax</button>
                <button id="ambassador" onClick={() => chooseAction('exchange')}>Exchange</button>
            </>
        );
    } else { // money over 10, has to coup
        controls = <button onClick={() => deductCoinsAndPickTarget('coup')}>Coup</button>;
    }

    return (
        <>
            <p className="DecisionTitle">Choose an action</p>
            <div className="DecisionButtonsContainer">
                {controls}
                <p>{actionError}</p>
            </div>
        </>
    );
};

export default ActionDecision;
