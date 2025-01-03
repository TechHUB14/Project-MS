import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState(true);

    // Load saved settings from localStorage on mount
    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('adminSettings'));
        if (savedSettings) {
            setUsername(savedSettings.username || '');
            setPassword(savedSettings.password || '');
            setEmail(savedSettings.email || '');
            setNotifications(savedSettings.notifications ?? true);
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        const settings = { username, password, email, notifications };
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Admin Settings</h2>
            <form onSubmit={handleSave}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        Enable Notifications
                    </label>
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};


