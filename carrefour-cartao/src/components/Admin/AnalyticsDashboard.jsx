import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { Activity, Users, Globe, MapPin, Zap, AlertTriangle } from 'lucide-react';
import AdminLayout from './AdminLayout';

// URL do mapa do Brasil (TopoJSON)
const geoUrl = "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson";

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/get-analytics');
            if (!res.ok) throw new Error(`Erro ${res.status} `);
            const json = await res.json();
            setData(json);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar analytics:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-screen items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carrefour-blue"></div>
                </div>
            </AdminLayout>
        );
    }

    // Mock de fallback caso a API falhe (para não ficar tela branca e "seco")
    const displayData = data || {
        onlineCount: 0,
        funnelData: [
            { name: 'Acesso', value: 0, fill: '#3b82f6' },
            { name: 'CPF', value: 0, fill: '#60a5fa' },
            { name: 'Dados', value: 0, fill: '#93c5fd' },
            { name: 'Entrega', value: 0, fill: '#c084fc' },
            { name: 'Pagamento', value: 0, fill: '#a855f7' },
            { name: 'Conversão', value: 0, fill: '#22c55e' }
        ],
        activeLocations: []
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-12 font-sans">
                <header className="bg-white border-b border-gray-200 py-6 px-8 sticky top-0 z-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-8 h-8 text-carrefour-blue" />
                            Analytics Ao Vivo
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Monitoramento em tempo real do tráfego brasileiro</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {error && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Offline (Usando Cache)</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-green-50 px-5 py-2 rounded-full border border-green-200 shadow-sm animate-pulse">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-green-800 font-bold text-base">
                                {displayData.onlineCount} Online
                            </span>
                        </div>
                    </div>
                </header>

                <div className="px-8 py-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Mapa do Brasil */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-[600px] overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-carrefour-blue" />
                                    Usuários no Brasil
                                </h3>
                            </div>

                            <div className="flex-1 rounded-xl overflow-hidden bg-gradient-to-b from-[#1e1b4b] to-[#312e81] relative shadow-inner flex items-center justify-center">
                                <ComposableMap
                                    projection="geoMercator"
                                    projectionConfig={{
                                        scale: 750,
                                        center: [-50, -15] // Foco no Brasil
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill="#4338ca"
                                                    stroke="#6366f1"
                                                    strokeWidth={0.5}
                                                    style={{
                                                        default: { outline: "none" },
                                                        hover: { fill: "#4f46e5", outline: "none" },
                                                        pressed: { outline: "none" },
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>

                                    {/* Pontos de Visitantes */}
                                    {displayData.activeLocations.map((loc, idx) => (
                                        <Marker key={idx} coordinates={[loc.lng, loc.lat]}>
                                            <g>
                                                <circle r={8} fill="rgba(34, 197, 94, 0.3)" className="animate-ping" />
                                                <circle r={4} fill="#22c55e" stroke="#fff" strokeWidth={1} />
                                            </g>
                                            <text
                                                textAnchor="middle"
                                                y={-12}
                                                style={{ fontFamily: "sans-serif", fill: "#fff", fontSize: "10px", fontWeight: "bold", textShadow: "0px 1px 2px black" }}
                                            >
                                                {loc.city}
                                            </text>
                                        </Marker>
                                    ))}
                                </ComposableMap>

                                <div className="absolute bottom-4 right-4 text-xs text-white/50">
                                    Mapa em tempo real
                                </div>
                            </div>
                        </div>

                        {/* Funil de Conversão */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-[600px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 z-10"></div>

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                        <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                                        Funil de Vendas
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Acompanhamento detalhado etapa por etapa</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Conversão Final</span>
                                    <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                                        {((displayData.funnelData[5].value / (displayData.funnelData[0].value || 1)) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 w-full h-full min-h-[300px] relative z-10 ml-[-20px] flex">
                                {/* Gráfico */}
                                <div className="flex-1 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            layout="vertical"
                                            data={displayData.funnelData}
                                            margin={{ top: 0, right: 60, left: 40, bottom: 0 }}
                                            barSize={40}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={90}
                                                tick={{ fontSize: 12, fontWeight: 700, fill: "#4b5563" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#fff7ed', radius: 8 }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1000}>
                                                {displayData.funnelData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} stroke="#fff" />
                                                ))}
                                                <LabelList
                                                    dataKey="value"
                                                    position="right"
                                                    style={{ fill: "#374151", fontWeight: "800", fontSize: "14px" }}
                                                    formatter={(val) => val.toLocaleString()}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Indicadores de Queda (Drop-off) Lateral */}
                                <div className="w-16 flex flex-col justify-around py-4 h-full">
                                    {displayData.funnelData.map((item, index) => {
                                        if (index === 0) return <div key={index} className="h-8"></div>; // Espaço para o primeiro
                                        const prev = displayData.funnelData[index - 1].value || 1;
                                        const curr = item.value;
                                        const percent = Math.round((curr / prev) * 100);
                                        const drop = 100 - percent;

                                        return (
                                            <div key={index} className="flex flex-col items-center justify-center h-full max-h-[40px]">
                                                <div className="text-[10px] font-bold text-gray-400">Passou</div>
                                                <div className={`text-xs font-bold ${percent > 50 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {percent}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Detalhes do Funil */}
                            <div className="mt-2 grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full">Checkout</span>
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-2xl font-black text-blue-900 tracking-tight">{displayData.funnelData[3].value}</span>
                                        <span className="text-xs text-blue-600 font-medium">pessoas</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider bg-green-100 px-2 py-0.5 rounded-full">Sucesso</span>
                                        <Zap className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-2xl font-black text-green-900 tracking-tight">{displayData.funnelData[5].value}</span>
                                        <span className="text-xs text-green-600 font-medium">vendas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
