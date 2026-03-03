/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Database, 
  UserCheck, 
  Languages, 
  ArrowRight, 
  MapPin, 
  FileText, 
  Search,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type View = 'landing' | 'form' | 'results' | 'aadhaar' | 'map';

interface Scheme {
  name: string;
  type: string;
  state?: string;
  benefit: string;
  reasons?: { text: string }[];
}

interface EligibilityResult {
  name: string;
  eligible: Scheme[];
  not_eligible: Scheme[];
}

const Logo = () => (
  <div className="flex items-center gap-2 cursor-pointer">
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* SVG recreation of the bridge logo */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M10 80 Q 50 10 90 80" fill="none" stroke="currentColor" strokeWidth="8" className="text-brand-orange opacity-40" />
        <path d="M20 80 Q 50 20 80 80" fill="none" stroke="currentColor" strokeWidth="8" className="text-brand-orange opacity-70" />
        <path d="M30 80 Q 50 30 70 80" fill="none" stroke="currentColor" strokeWidth="8" className="text-brand-orange" />
      </svg>
    </div>
    <span className="text-2xl font-black tracking-tighter text-white">VAARADHI</span>
  </div>
);

const Navbar = ({ setView, currentView }: { setView: (v: View) => void, currentView: View }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div onClick={() => setView('landing')}>
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('landing')} className={`text-sm font-bold transition-colors ${currentView === 'landing' ? 'text-brand-orange' : 'text-gray-400 hover:text-white'}`}>Home</button>
            <button onClick={() => setView('form')} className={`text-sm font-bold transition-colors ${currentView === 'form' ? 'text-brand-orange' : 'text-gray-400 hover:text-white'}`}>Check Eligibility</button>
            <button onClick={() => setView('aadhaar')} className={`text-sm font-bold transition-colors ${currentView === 'aadhaar' ? 'text-brand-orange' : 'text-gray-400 hover:text-white'}`}>Aadhaar Assistance</button>
            <button onClick={() => setView('map')} className={`text-sm font-bold transition-colors ${currentView === 'map' ? 'text-brand-orange' : 'text-gray-400 hover:text-white'}`}>Find Offices</button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-b border-white/5 overflow-hidden"
          >
            <div className="py-4 px-4 space-y-4">
              <button onClick={() => { setView('landing'); setIsOpen(false); }} className="block w-full text-left text-sm font-bold text-gray-400">Home</button>
              <button onClick={() => { setView('form'); setIsOpen(false); }} className="block w-full text-left text-sm font-bold text-brand-orange">Check Eligibility</button>
              <button onClick={() => { setView('aadhaar'); setIsOpen(false); }} className="block w-full text-left text-sm font-bold text-gray-400">Aadhaar Assistance</button>
              <button onClick={() => { setView('map'); setIsOpen(false); }} className="block w-full text-left text-sm font-bold text-gray-400">Find Offices</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([
    { text: "Namaste! I'm Vaaradhi AI. How can I assist you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What schemes am I eligible for?",
    "Explain PM Kisan Samman Nidhi",
    "How to update Aadhaar?",
    "Where is the nearest office?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput("");

    // Simulated responses
    setTimeout(() => {
      let reply = "";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes("eligible")) {
        reply = "To check your eligibility, please use our 'Check Eligibility' tool in the navigation bar. You'll need to enter basic details like age, income, and occupation.";
      } else if (lowerMsg.includes("student")) {
        reply = "As a student, you might be eligible for various Central and State scholarships (like NSP), skill development programs (PMKVY), and education loans with interest subsidies. Please use the 'Check Eligibility' form and select 'Student' as your occupation for a personalized list.";
      } else if (lowerMsg.includes("explain scheme one") || lowerMsg.includes("pm kisan")) {
        reply = "PM Kisan Samman Nidhi (Scheme One) provides ₹6000 annual income support to farmers in three installments. It's a Central Government initiative to support agricultural families.";
      } else if (lowerMsg.includes("explain scheme two") || lowerMsg.includes("ayushman bharat")) {
        reply = "Ayushman Bharat (Scheme Two) is a health insurance scheme providing coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.";
      } else if (lowerMsg.includes("explain scheme three") || lowerMsg.includes("awas yojana")) {
        reply = "Pradhan Mantri Awas Yojana (Scheme Three) provides financial assistance and interest subsidies to help low-income families build or buy their own homes.";
      } else if (lowerMsg.includes("aadhaar")) {
        reply = "You can update your Aadhaar at any authorized Aadhaar Kendra. Check our 'Aadhaar Assistance' section for step-by-step video tutorials.";
      } else if (lowerMsg.includes("office") || lowerMsg.includes("where")) {
        reply = "You can find the nearest Sachivalayam or Aadhaar center in our 'Find Offices' section. It includes a map and a list of locations.";
      } else {
        reply = "I'm here to help! You can ask about specific schemes (like PM Kisan or Ayushman Bharat), eligibility criteria, or how to use this portal.";
      }

      setMessages(prev => [...prev, { text: reply, isUser: false }]);
    }, 600);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center shadow-2xl z-[1000] hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-80 h-96 glass-card rounded-2xl flex flex-col z-[1001] shadow-2xl border border-white/10"
          >
            <div className="p-4 border-b border-white/5 font-bold">Vaaradhi AI</div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.isUser ? 'bg-brand-orange text-white' : 'bg-white/5 text-gray-300'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {!messages[messages.length-1].isUser && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedQuestions.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(q)}
                      className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:bg-brand-orange/20 hover:border-brand-orange/50 transition-all text-gray-400 hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
              />
              <button onClick={handleSend} className="p-2 bg-brand-orange rounded-lg">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AadhaarAssistance = () => {
  const tutorials = [
    { lang: 'Telugu', id: 'XdH9uK3K1sI' },
    { lang: 'English', id: 'Kxe2U63TQ50' },
    { lang: 'Hindi', id: 'Q6jtsl5BWvY' },
    { lang: 'Tamil', id: 'tLhOFX1LUNw' },
    { lang: 'Kannada', id: 'zTE2IRpBHDA' },
    { lang: 'Malayalam', id: 'fJPGMVcCqLU' }
  ];

  const [activeVideo, setActiveVideo] = useState(tutorials[0].id);

  return (
    <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">Aadhaar Assistance</h1>
        <p className="text-gray-400 text-lg">Step-by-step guides to keep your identity updated</p>
      </motion.div>

      <div className="glass-card p-10 rounded-3xl border border-white/10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-4">Updation Tutorials</h3>
          <p className="text-gray-400 text-sm mb-8">Select your preferred language to watch the guide:</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tutorials.map(t => (
              <button 
                key={t.lang}
                onClick={() => setActiveVideo(t.id)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeVideo === t.id ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {t.lang}
              </button>
            ))}
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeVideo}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="text-brand-orange w-5 h-5" />
            </div>
            <h5 className="font-bold mb-2">Required Docs</h5>
            <p className="text-xs text-gray-400">POI, POA, and DOB proof documents.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-brand-orange w-5 h-5" />
            </div>
            <h5 className="font-bold mb-2">Find Center</h5>
            <p className="text-xs text-gray-400">Locate your nearest Aadhaar Seva Kendra.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-brand-orange w-5 h-5" />
            </div>
            <h5 className="font-bold mb-2">Verify Online</h5>
            <p className="text-xs text-gray-400">Check your update status on UIDAI portal.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SchemeDetailsModal = ({ scheme, onClose }: { scheme: Scheme, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-48 bg-brand-orange flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter">{scheme.name}</h2>
          </div>
        </div>
        
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scheme Type</p>
              <p className="font-bold text-gray-900">{scheme.type} Government</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Applicable State</p>
              <p className="font-bold text-gray-900">{scheme.state || 'All India'}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="text-brand-orange w-5 h-5" /> Primary Benefit
            </h4>
            <p className="text-gray-600 leading-relaxed bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/10">
              {scheme.benefit}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Eligibility Criteria</h4>
              <ul className="space-y-3">
                {['Indian Citizenship', 'Valid Aadhaar Card', 'Income within limits', 'Age verification'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Required Documents</h4>
              <ul className="space-y-3">
                {['Aadhaar Card', 'Income Certificate', 'Residence Proof', 'Bank Passbook'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full py-4 bg-brand-orange text-white font-bold rounded-2xl shadow-xl shadow-brand-orange/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
              Proceed to Official Portal <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OfficeLocator = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([17.6868, 83.2185]); // Default to Visakhapatnam
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const stateOffices: Record<string, string> = {
    "Andhra Pradesh": "Grama Sachivalayam",
    "Telangana": "MeeSeva Centre",
    "Tamil Nadu": "e-Seva Centre",
    "Karnataka": "Karnataka One",
    "Delhi": "e-District Centre",
    "Maharashtra": "Aaple Sarkar Seva Kendra",
    "West Bengal": "Duare Sarkar Camp",
    "Rajasthan": "e-Mitra Kiosk",
    "Odisha": "Common Service Centre (CSC)",
    "Assam": "Arunodoi CSC",
    "Madhya Pradesh": "Lok Seva Kendra",
    "Bihar": "RTPS Counter",
    "Uttar Pradesh": "Jan Seva Kendra",
    "Haryana": "Antyodaya Saral Kendra",
    "Kerala": "Akshaya Centre",
    "Gujarat": "Jan Seva Kendra",
    "Chhattisgarh": "Lok Seva Kendra"
  };

  const [offices, setOffices] = useState([
    { name: "Gajuwaka Sachivalayam", lat: 17.6905, lng: 83.2091, address: "Gajuwaka Main Rd, Visakhapatnam" },
    { name: "MVP Colony Office", lat: 17.7412, lng: 83.3312, address: "MVP Sector 1, Visakhapatnam" },
    { name: "Madhurawada Center", lat: 17.8178, lng: 83.3456, address: "Madhurawada, Visakhapatnam" },
    { name: "Jagadamba Junction Office", lat: 17.7112, lng: 83.3012, address: "Jagadamba, Visakhapatnam" },
    { name: "Anakapalle Sub-office", lat: 17.6895, lng: 83.0025, address: "Anakapalle, Andhra Pradesh" },
    { name: "Vijayawada Central Office", lat: 16.5062, lng: 80.6480, address: "MG Road, Vijayawada" },
    { name: "Tirupati Seva Kendra", lat: 13.6288, lng: 79.4192, address: "KT Road, Tirupati" },
    { name: "Guntur District Office", lat: 16.3067, lng: 80.4365, address: "Collectorate, Guntur" }
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      // Use Nominatim for real geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", India")}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);

        // Generate dynamic mock offices for the searched area
        const stateMatch = Object.keys(stateOffices).find(s => display_name.includes(s)) || "Andhra Pradesh";
        const officeName = stateOffices[stateMatch];

        const dynamicOffices = [
          { name: `${officeName} - Main`, lat: newCenter[0] + 0.005, lng: newCenter[1] + 0.005, address: `Near ${display_name.split(',')[0]}` },
          { name: `${officeName} - Branch`, lat: newCenter[0] - 0.005, lng: newCenter[1] - 0.005, address: `Area Office, ${display_name.split(',')[0]}` },
          { name: `Aadhaar Seva Kendra`, lat: newCenter[0] + 0.008, lng: newCenter[1] - 0.002, address: `Central Plaza, ${display_name.split(',')[0]}` }
        ];
        setOffices(dynamicOffices);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">Find Nearest Offices</h1>
        <p className="text-gray-400 text-lg">Locate Sachivalayams and Aadhaar Centers near you</p>
      </motion.div>

      <div className="flex flex-col gap-12">
        <div className="w-full">
          <div className="glass-card p-4 rounded-3xl border border-white/10 h-[500px] relative">
            <div className="absolute top-8 left-8 right-8 z-[1000] flex gap-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area or office name..." 
                className="flex-1 bg-brand-dark/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange"
              />
              <button 
                onClick={handleSearch} 
                disabled={loading}
                className="px-6 py-3 bg-brand-orange rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>
            <div className="h-full rounded-2xl overflow-hidden">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}
                {offices.map((o, i) => (
                  <Marker key={i} position={[o.lat, o.lng]}>
                    <Popup>
                      <div className="text-brand-dark">
                        <h6 className="font-bold">{o.name}</h6>
                        <p className="text-xs">{o.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <ChangeView center={mapCenter} />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h4 className="text-2xl font-bold mb-6 px-2">Nearby Locations</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((o, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => handleLocationClick(o.lat, o.lng)}
                className="p-6 glass-card rounded-2xl border border-white/5 cursor-pointer hover:border-brand-orange/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h5 className="font-bold group-hover:text-brand-orange transition-colors text-lg">{o.name}</h5>
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-brand-orange" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">{o.address}</p>
                <div className="flex items-center justify-between">
                  <button 
                    className="text-xs font-bold text-brand-orange flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`, '_blank');
                    }}
                  >
                    Get Directions <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Open Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const EligibilityForm = ({ onResult }: { onResult: (res: EligibilityResult, aadhar: string) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    occupation: 'Student',
    gender: 'Male',
    marital_status: 'Single',
    state: 'Andhra Pradesh',
    aadhar: 'Yes'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          income: parseInt(formData.income)
        })
      });
      const data = await res.json();
      onResult(data, formData.aadhar);
    } catch (error) {
      console.error("Form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">Vaaradhi</h1>
        <p className="text-gray-400 text-lg">Bridge to Government Benefits</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl glass-card p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your name" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Age</label>
            <input 
              type="number" 
              required
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="e.g. 25" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Annual Income (₹)</label>
            <input 
              type="number" 
              required
              value={formData.income}
              onChange={(e) => setFormData({...formData, income: e.target.value})}
              placeholder="e.g. 300000" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Occupation</label>
            <select 
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              <option value="Student">Student</option>
              <option value="Farmer">Farmer</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Private Employee">Private Employee</option>
              <option value="Government Employee">Government Employee</option>
              <option value="Self Employed">Self Employed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Marital Status</label>
            <select 
              value={formData.marital_status}
              onChange={(e) => setFormData({...formData, marital_status: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              <option value="Single">Single / Unmarried</option>
              <option value="Married">Married</option>
              <option value="Widow">Widow / Widower</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">State</label>
            <select 
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Is Aadhaar Updated?</label>
            <select 
              value={formData.aadhar}
              onChange={(e) => setFormData({...formData, aadhar: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              <option value="Yes">Yes, recently updated</option>
              <option value="No">No / Outdated</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brand-orange hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing..." : "Analyze My Eligibility"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

const ResultsView = ({ result, aadhar, onBack, onGoToAadhaar, onGoToMap }: { result: EligibilityResult, aadhar: string, onBack: () => void, onGoToAadhaar: () => void, onGoToMap: () => void }) => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  return (
    <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <AnimatePresence>
        {selectedScheme && (
          <SchemeDetailsModal 
            scheme={selectedScheme} 
            onClose={() => setSelectedScheme(null)} 
          />
        )}
      </AnimatePresence>

      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Form
      </button>

      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Analysis for <span className="text-brand-orange">{result.name}</span>
      </motion.h1>

      {aadhar === 'No' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl mb-12 flex gap-4 items-start"
        >
          <AlertTriangle className="text-red-500 w-6 h-6 shrink-0" />
          <div>
            <h4 className="text-red-400 font-bold mb-1">⚠️ Warning: Aadhaar Update Required</h4>
            <p className="text-gray-300 text-sm mb-4">
              Your eligibility for many schemes is restricted because your Aadhaar is not updated. 
              Please visit our Aadhaar Assistance center for tutorials.
            </p>
            <button 
              onClick={onGoToAadhaar}
              className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              Go to Aadhaar Assistance
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-12">
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-500 w-6 h-6" /> Eligible Schemes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.eligible.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedScheme(s)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl relative group cursor-pointer"
              >
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Eligible</span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 pr-12">{s.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{s.benefit}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.type} Scheme</span>
                  <button className="text-brand-orange text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-400">
            <XCircle className="text-red-400 w-6 h-6" /> Ineligible Schemes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.not_eligible.map((s, i) => (
              <motion.div 
                key={i}
                className="bg-white/5 p-6 rounded-2xl border border-white/5 relative opacity-80"
              >
                <span className="absolute top-4 right-4 bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Ineligible</span>
                <h2 className="text-xl font-bold text-gray-300 mb-4 pr-12">{s.name}</h2>
                <ul className="space-y-2">
                  {s.reasons?.map((r, ri) => (
                    <li key={ri} className="text-red-400 text-xs flex gap-2 items-start">
                      <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {r.text}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 pt-24 border-t border-white/5 text-center">
        <h2 className="text-3xl font-bold mb-6">Need to visit an office?</h2>
        <p className="text-gray-400 mb-10">Find your nearest Sachivalayam or Aadhaar center on our interactive map.</p>
        <button 
          onClick={onGoToMap}
          className="px-10 py-4 bg-brand-orange hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-brand-orange/20 flex items-center gap-2 mx-auto"
        >
          Open Office Locator <MapPin className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const Hero = ({ onStart }: { onStart: () => void }) => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            Government Benefits, Simplified.
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tighter">
            Bridging the Gap to <span className="text-brand-orange">Government Benefits.</span>
          </h1>
          <p className="text-gray-400 text-xl mb-10 max-w-lg leading-relaxed">
            VAARADHI is your digital bridge to discover, understand, and access welfare schemes tailored to your profile.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-brand-orange hover:bg-red-600 text-white font-bold rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-brand-orange/30 text-lg"
            >
              Get Started <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-brand-orange/10 blur-[100px] rounded-full" />
          <div className="relative glass-card p-4 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1541844053589-346841d0b34c?auto=format&fit=crop&q=80&w=1200" 
              alt="Digital Bridge" 
              className="rounded-[32px] object-cover w-full aspect-[4/5] shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                <p className="text-sm font-bold text-brand-orange mb-1">Empowering Citizens</p>
                <p className="text-xs text-gray-400">Direct access to 500+ Central & State schemes.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: "Secure & Private",
      description: "Your data is protected and never shared with third parties."
    },
    {
      icon: <Database className="w-6 h-6 text-brand-orange" />,
      title: "Government Data",
      description: "Official scheme information sourced directly from government portals."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-brand-orange" />,
      title: "Aadhaar Guidance",
      description: "Complete assistance for Aadhaar updates and verification."
    },
    {
      icon: <Languages className="w-6 h-6 text-brand-orange" />,
      title: "Multi-lingual",
      description: "Support in multiple regional languages for better accessibility."
    }
  ];

  return (
    <section className="py-20 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gray-400 mb-2">We simplify access to welfare schemes by guiding you step by step.</p>
          <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-brand-card border border-white/5 hover:border-brand-orange/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = ({ onStart }: { onStart: () => void }) => {
  const steps = [
    {
      num: "01",
      icon: <FileText className="w-6 h-6" />,
      title: "Enter Your Details",
      description: "Name, age, income, marital status, state, and occupation."
    },
    {
      num: "02",
      icon: <Search className="w-6 h-6" />,
      title: "Instant Eligibility Check",
      description: "Smart system matches you with relevant government schemes."
    },
    {
      num: "03",
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Get Complete Details",
      description: "Documents required, benefits, how to apply, official links."
    },
    {
      num: "04",
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Nearby Offices",
      description: "Find nearest government offices using location-based maps."
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How VAARADHI Works</h2>
          <p className="text-gray-400">Four simple steps to discover schemes you're eligible for</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-8xl font-black text-white/[0.03] absolute -top-10 -left-4 select-none">
                {step.num}
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-6 text-brand-orange">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={onStart}
            className="px-10 py-4 bg-brand-orange hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-brand-orange/20"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-card border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo />
            </div>
            <p className="text-gray-400 max-w-sm mb-8">
              India's Smart Government Scheme Eligibility Checker. Simplifying access to welfare schemes for every citizen.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Check Eligibility</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Aadhaar Assistance</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Find Offices</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            <span className="font-bold text-gray-400">Disclaimer:</span> VAARADHI is an independent information platform and is not directly affiliated with the Government of India or any state government. Information is sourced from publicly available data. Users are advised to verify details from official government websites before applying.
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">© 2025 VAARADHI. All rights reserved.</p>
            <p className="text-xs text-gray-500">Made with ❤️ for India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [aadhar, setAadhar] = useState('Yes');

  const handleResult = (res: EligibilityResult, aadharStatus: string) => {
    setResult(res);
    setAadhar(aadharStatus);
    setView('results');
    window.scrollTo(0, 0);
  };

  const navigateToView = (v: View) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen selection:bg-brand-orange/30 selection:text-brand-orange bg-brand-dark text-white">
      <Navbar setView={navigateToView} currentView={view} />
      <main>
        {view === 'landing' && (
          <>
            <Hero onStart={() => setView('form')} />
            <Features />
            <HowItWorks onStart={() => setView('form')} />
          </>
        )}
        {view === 'form' && (
          <EligibilityForm onResult={handleResult} />
        )}
        {view === 'results' && result && (
          <ResultsView 
            result={result} 
            aadhar={aadhar} 
            onBack={() => setView('form')} 
            onGoToAadhaar={() => setView('aadhaar')}
            onGoToMap={() => setView('map')}
          />
        )}
        {view === 'aadhaar' && (
          <AadhaarAssistance />
        )}
        {view === 'map' && (
          <OfficeLocator />
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
