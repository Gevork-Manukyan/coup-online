import React, { useState } from 'react';
import ReactModal from 'react-modal';
import CheatSheet from '../assets/CheatSheet.svg';

function CheatSheetModal() {
    const [showCheatSheetModal, setShowCheatSheetModal] = useState(false);

    const handleOpenCheatSheetModal = () => {
        setShowCheatSheetModal(true);
    };

    const handleCloseCheatSheetModal = () => {
        setShowCheatSheetModal(false);
    };

    return (
        <>
            <div className="CheatSheet" onClick={handleOpenCheatSheetModal}>
                <p>Cheat Sheet</p>
                <svg className="InfoIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                    <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                        <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                            <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                            <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                        </g>
                        <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                    </g>
                </svg>
            </div>
            <ReactModal 
                isOpen={showCheatSheetModal}
                contentLabel="Minimal Modal Example"
                onRequestClose={handleCloseCheatSheetModal}
                shouldCloseOnOverlayClick={true}
                className="CheatSheetModal"
            >
                <div className="CloseModalButtonContainer">
                    <button className="CloseModalButton" onClick={handleCloseCheatSheetModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                            <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                                <g id="Ellipse_1" data-name="Ellipse 1" className="cls-5" transform="translate(39 377)">
                                    <circle className="cls-7" cx="10.5" cy="10.5" r="10.5"/>
                                    <circle className="cls-8" cx="10.5" cy="10.5" r="10"/>
                                </g>
                                <text id="x" className="cls-6" transform="translate(46 391)"><tspan x="0" y="0">x</tspan></text>
                            </g>
                        </svg>
                    </button>
                </div>
                <div className="CheatSheetContainer">
                    <img src={CheatSheet} alt="Cheat-Sheet"/>
                </div>
            </ReactModal>
        </>
    );
}

export default CheatSheetModal;
