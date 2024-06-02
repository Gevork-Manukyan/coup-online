import React, { useEffect, useRef } from 'react';

function EventLog({ logs }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    return (
        <div className="EventLogContainer">
            <p className="bold EventLogTitle">Event Log</p>
            <div className="EventLogBody">
                {logs.map((log, index) => (
                    <p key={index} className={index === logs.length - 1 ? "new" : ""}>
                        {log}
                    </p>
                ))}
                <div style={{ float: "left", clear: "both" }} ref={messagesEndRef}></div>
            </div>
        </div>
    );
}

export default EventLog;
