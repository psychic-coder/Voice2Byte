import React, { useEffect, useState } from 'react';

export const announceToScreenReader = (message) => {
    if (typeof window !== "undefined") {
        const event = new CustomEvent('aria-announce', { detail: message });
        window.dispatchEvent(event);
    }
};

export default function AriaAnnouncer() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleAnnounce = (e) => {
            setMessage(e.detail);
            setTimeout(() => setMessage(''), 3000);
        };
        window.addEventListener('aria-announce', handleAnnounce);
        return () => window.removeEventListener('aria-announce', handleAnnounce);
    }, []);

    return (
        <div aria-live="assertive" className="visually-hidden" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', whiteSpace: 'nowrap', clip: 'rect(0, 0, 0, 0)' }}>
            {message}
        </div>
    );
}
