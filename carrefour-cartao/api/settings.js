import { PrismaClient } from '@prisma/client';

let prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default async function handler(req, res) {
    // CORS Configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const settingsRecord = await prisma.visitor.findUnique({
                where: { ip: 'GLOBAL_SETTINGS_STORE' }
            });

            if (settingsRecord && settingsRecord.stages) {
                return res.status(200).json(JSON.parse(settingsRecord.stages));
            }

            // Return null if not found (frontend will use defaults)
            return res.status(200).json({});
        }

        if (req.method === 'POST') {
            const newSettings = req.body;

            // Upsert: Create if not exists, update if exists
            // Using 'GLOBAL_SETTINGS_STORE' as the unique IP key
            await prisma.visitor.upsert({
                where: { ip: 'GLOBAL_SETTINGS_STORE' },
                update: {
                    stages: JSON.stringify(newSettings),
                    lastSeen: new Date()
                },
                create: {
                    ip: 'GLOBAL_SETTINGS_STORE',
                    stages: JSON.stringify(newSettings),
                    // Optional fields can be omitted or set to null
                    device: 'SYSTEM',
                    location: 'SERVER',
                    currentPath: '/settings',
                    visitedHome: false
                }
            });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Settings API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
