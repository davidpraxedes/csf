
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const STAGE_MAP = {
    '/': 'home',
    '/cpf': 'cpf',
    '/verify': 'cpf',
    '/kyc': 'cpf', // Fluxo pode variar
    '/products': 'form',
    '/delivery': 'delivery',
    '/payment': 'payment',
    '/virtual': 'converted'
};

export const useAnalytics = () => {
    const location = useLocation();
    const lastPathRef = useRef(null);

    useEffect(() => {
        const path = location.pathname;
        const stage = STAGE_MAP[path] || 'unknown';

        // Prevenir tracking duplicado imediato (React.StrictMode pode disparar 2x)
        if (lastPathRef.current === path) return;
        lastPathRef.current = path;

        const track = async () => {
            try {
                await fetch('/api/track-visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path,
                        stage,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                // Silently fail to not disturb user
                console.error('[Analytics] Fail:', error);
            }
        };

        track();

        // Heartbeat a cada 30s para manter "online"
        const heartbeat = setInterval(() => {
            track();
        }, 30000);

        return () => clearInterval(heartbeat);

    }, [location]);
};
