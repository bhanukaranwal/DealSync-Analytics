import React, { useState, useMemo, useEffect } from 'react';

// Import Components
import Card from './components/Card';
import ValuationTabs from './components/valuation/ValuationTabs';
import DCFCalculator from './components/valuation/DCFCalculator';
import ComparableCompanyAnalysis from './components/valuation/ComparableCompanyAnalysis';
import PrecedentTransactions from './components/valuation/PrecedentTransactions';
import FootballFieldChart from './components/valuation/FootballFieldChart';
import SynergyEngine from './components/synergy/SynergyEngine';
import AccretionDilutionAnalysis from './components/deal/AccretionDilutionAnalysis';
import RiskAnalysis from './components/info/RiskAnalysis';
import MarketDataFeed from './components/info/MarketDataFeed';
import ComplianceModule from './components/info/ComplianceModule';

// Import Icons
import { Download, Settings, Scale, Zap, TrendingUp, BarChart2, Shield, Search, AlertTriangle } from 'lucide-react';

// Import Calculations
import { calculateDCF } from './utils/calculations';

export default function App() {
    const [activeValuationTab, setActiveValuationTab] = useState('dcf');
    const [maximizedCard, setMaximizedCard] = useState(null);

    // Lifted state (values in millions)
    const [cashFlows, setCashFlows] = useState([50, 55, 60, 65, 70]);
    const [wacc, setWacc] = useState(8.5);
    const [terminalGrowth, setTerminalGrowth] = useState(2.5);
    const [costSynergies, setCostSynergies] = useState({ sga: 25, rd: 15, cogs: 10 });
    const [revenueSynergies, setRevenueSynergies] = useState({ crossSell: 40, marketExpansion: 40 });
    const [synergyNpv, setSynergyNpv] = useState(0);

    // Derived state
    const dcfAnalysis = useMemo(() => calculateDCF(cashFlows, wacc, terminalGrowth), [cashFlows, wacc, terminalGrowth]);

    const renderValuationContent = () => {
        switch (activeValuationTab) {
            case 'cca': return <ComparableCompanyAnalysis />;
            case 'pta': return <PrecedentTransactions />;
            case 'dcf':
            default:
                return <DCFCalculator cashFlows={cashFlows} setCashFlows={setCashFlows} wacc={wacc} setWacc={setWacc} terminalGrowth={terminalGrowth} setTerminalGrowth={setTerminalGrowth} dcfAnalysis={dcfAnalysis} />;
        }
    };
    
    useEffect(() => {
        const handleEsc = (event) => { if (event.keyCode === 27) setMaximizedCard(null); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const cardsConfig = {
        'valuation': { title: "Advanced Valuation Suite", icon: <Scale className="w-5 h-5 text-sky-400" />, content: <><ValuationTabs onSelect={setActiveValuationTab} activeTab={activeValuationTab} />{renderValuationContent()}</> },
        'synergy': { title: "Synergy Optimization Engine", icon: <Zap className="w-5 h-5 text-sky-400" />, content: <SynergyEngine costSynergies={costSynergies} setCostSynergies={setCostSynergies} revenueSynergies={revenueSynergies} setRevenueSynergies={setRevenueSynergies} synergyNpv={synergyNpv} setSynergyNpv={setSynergyNpv} /> },
        'accretion': { title: "Accretion / (Dilution) Analysis", icon: <TrendingUp className="w-5 h-5 text-sky-400" />, content: <AccretionDilutionAnalysis dcfAnalysis={dcfAnalysis} synergyNpv={synergyNpv} /> },
        'risk': { title: "Risk Analysis", icon: <Shield className="w-5 h-5 text-sky-400" />, content: <RiskAnalysis /> },
        'market': { title: "Market Data & News", icon: <Search className="w-5 h-5 text-sky-400" />, content: <MarketDataFeed /> },
        'compliance': { title: "Regulatory & Compliance", icon: <AlertTriangle className="w-5 h-5 text-sky-400" />, content: <ComplianceModule /> },
    };
    const cardToRender = maximizedCard ? cardsConfig[maximizedCard] : null;

    if (maximizedCard && cardToRender) {
        return (
             <div className="bg-gray-900 text-gray-200 font-sans min-h-screen">
                <Card title={cardToRender.title} icon={cardToRender.icon} isMaximized={true} onMinimize={() => setMaximizedCard(null)}>{cardToRender.content}</Card>
             </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-200 font-sans min-h-screen p-4">
            <div className="container mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">DealSync Analytics</h1>
                        <p className="text-sm text-gray-400">Comprehensive M&A Deal Analysis Platform</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="p-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"><Download className="w-5 h-5 text-sky-300" /></button>
                        <button className="p-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"><Settings className="w-5 h-5 text-sky-300" /></button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title={cardsConfig.valuation.title} icon={cardsConfig.valuation.icon} onMaximize={() => setMaximizedCard('valuation')}>{cardsConfig.valuation.content}</Card>
                        <Card title={cardsConfig.synergy.title} icon={cardsConfig.synergy.icon} onMaximize={() => setMaximizedCard('synergy')} defaultOpen={false}>{cardsConfig.synergy.content}</Card>
                        <Card title={cardsConfig.accretion.title} icon={cardsConfig.accretion.icon} onMaximize={() => setMaximizedCard('accretion')} defaultOpen={false}>{cardsConfig.accretion.content}</Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Valuation Football Field" icon={<BarChart2 className="w-5 h-5 text-sky-400" />}><FootballFieldChart dcfAnalysis={dcfAnalysis} /></Card>
                        <Card title={cardsConfig.risk.title} icon={cardsConfig.risk.icon} onMaximize={() => setMaximizedCard('risk')} defaultOpen={false}>{cardsConfig.risk.content}</Card>
                        <Card title={cardsConfig.market.title} icon={cardsConfig.market.icon} onMaximize={() => setMaximizedCard('market')} defaultOpen={false}>{cardsConfig.market.content}</Card>
                        <Card title={cardsConfig.compliance.title} icon={cardsConfig.compliance.icon} onMaximize={() => setMaximizedCard('compliance')} defaultOpen={false}>{cardsConfig.compliance.content}</Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
