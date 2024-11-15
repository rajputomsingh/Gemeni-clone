import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../Context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompt, setRecentPrompt } = useContext(Context); // Renamed `prevPrompts` to `prevPrompt`

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    // Toggle sidebar extension
    const toggleExtended = () => setExtended(!extended);

    // Start a new chat and refresh the page
    const startNewChat = () => {
        setRecentPrompt("");
        onSent("");
        window.location.reload(); // Refresh the page
    };

    return (
        <div className={`Sidebar ${extended ? 'extended' : ''}`}>
            <div className="top">
                {/* Menu Icon with click handler */}
                <img 
                    className="menu" 
                    src={assets.menu_icon} 
                    alt="menu icon" 
                    onClick={toggleExtended} 
                    aria-expanded={extended}
                />

                {/* New Chat section */}
                <div className="new-chat" onClick={startNewChat}>
                    <img src={assets.plus_icon} alt="new chat icon" />
                    {extended && <p>New Chat</p>}
                </div>

                {/* Recent section */}
                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompt.map((item, index) => (
                            <div onClick={() => loadPrompt(item)} className="recent-entry" key={index}>
                                <img src={assets.message_icon} alt="message icon" />
                                <p>{item.slice(0, 18)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bottom">
                {/* Bottom items */}
                <div className="bottom-item">
                    <img src={assets.question_icon} alt="help icon" />
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item">
                    <img src={assets.history_icon} alt="activity icon" />
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item">
                    <img src={assets.setting_icon} alt="settings icon" />
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
    