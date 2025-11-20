import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Sparkles, X, Copy, Loader, MessageCircle } from 'lucide-react';

const App = () => {
  // --- Configuration ---
  // REPLACE THESE URLS WITH YOUR LOCAL FILE PATHS
  const assets = {
    img6: "/api/placeholder/100/100", // Oitijjer Haat Logo.png
    img4: "/api/placeholder/100/100", // Manikganj Association Logo.png
    img1: "/api/placeholder/100/100",       // DIU Logo.png
    
    img2: "/api/placeholder/600/400",     // Hazari Gur 3.jpg
    img3: "/api/placeholder/600/400",        // Khejor Ros.jpeg
    img5: "/api/placeholder/600/400",      // Nijam Sweet 5.jpg
    img7: "/api/placeholder/600/400",      // Pitha 2.jpeg
    img8: "/api/placeholder/600/400",    // Sweet 4.jpeg
  };

  // Slide Data
  const slides = [
    {
      id: 1,
      type: 'text',
      duration: 14000, // Longer time to read the letter
      content: {
        logos: [assets.img1, assets.img6, assets.img4],
        title: "সশ্রদ্ধ আমন্ত্রণ",
        body: `ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি আয়োজিত “ঐতিহ্যের হাট”–২০২৫-এ মানিকগঞ্জের গর্ব, ঐতিহ্য ও সংস্কৃতির ছোঁয়া নিয়ে আমরা থাকছি “মানিকগঞ্জ স্টল”-এ।
        
        আয়োজনে থাকবে আমাদের জেলার গর্ব— হাজারি গুড়ের মিষ্টি সুবাস, খেজুরের রসের মায়া, আর গ্রামীণ পিঠার উষ্ণতায় ভরা ছোট্ট এক টুকরো মানিকগঞ্জ। আপনার মূল্যবান উপস্থিতি আমাদের জন্য হবে পরম আনন্দ ও অনুপ্রেরণার উৎস। আপনার স্নেহ, পরামর্শ ও প্রেরণায় আমাদের এই আয়োজন পাবে পূর্ণতা।`,
        signature: "সাদর আমন্ত্রণান্তে,\nমানিকগঞ্জ জেলা"
      }
    },
    {
      id: 2,
      type: 'image',
      duration: 5000,
      title: "ঐতিহ্যবাহী হাজারি গুড়",
      subTitle: "Hazari Gur",
      image: assets.img2,
      desc: "ঝিটকার হাজারি গুড় - মানিকগঞ্জের ১০০০ বছরের ঐতিহ্য"
    },
    {
      id: 3,
      type: 'image',
      duration: 5000,
      title: "তাঁজা খেজুরের রস",
      subTitle: "Khejor r Ros",
      image: assets.img3,
      desc: "শীতের সকালের অমৃত সুধা"
    },
    {
      id: 4,
      type: 'image',
      duration: 5000,
      title: "নিজাম সুইটস",
      subTitle: "Nijam Sweets",
      image: assets.img5,
      desc: "মানিকগঞ্জের মিষ্টির আভিজাত্য"
    },
    {
      id: 5,
      type: 'image',
      duration: 5000,
      title: "মায়ের হাতের পিঠা",
      subTitle: "Traditional Pitha",
      image: assets.img7,
      desc: "গ্রামীণ বাংলার উষ্ণ অভ্যর্থনা"
    },
    {
      id: 6,
      type: 'image',
      duration: 5000,
      title: "পলাশের পান্তুয়া",
      subTitle: "Polash r Pantuya",
      image: assets.img8,
      desc: "জিভে জল আনা অনন্য স্বাদ"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Gemini AI State
  const [showModal, setShowModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [generatedInvite, setGeneratedInvite] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Auto-play logic (Pauses when modal is open)
  useEffect(() => {
    if (showModal) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slides[currentIndex].duration);

    return () => clearTimeout(timer);
  }, [currentIndex, showModal]);

  // --- Gemini API Integration ---
  const generateAIInvite = async () => {
    if (!guestName.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setGeneratedInvite('');

    const apiKey = ""; // Provided by environment at runtime
    const systemPrompt = "You are an expert in Bengali culture and etiquette. Write short, warm, poetic invitation messages for an event called 'Oitijjer Haat'. Use themes of Manikganj, Hazari Gur, and Pitha.";
    const userPrompt = `Write a short (max 40 words) invitation message in Bengali addressed to "${guestName}". It is for the 'Manikganj Stall' at 'Oitijjer Haat'. Mention the smell of date juice (khejur ros) and warmth of winter. Tone: Respectful and inviting.`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
      let attempt = 0;
      let success = false;
      let data;

      while (attempt < 3 && !success) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );

          if (!response.ok) throw new Error(response.statusText);
          
          data = await response.json();
          success = true;
        } catch (e) {
          attempt++;
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }

      if (success && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeneratedInvite(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (err) {
      setError("দুঃখিত, বার্তা তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedInvite) {
      navigator.clipboard.writeText(generatedInvite);
      alert("বার্তাটি কপি করা হয়েছে!");
    }
  };

  // --- Thanos "Dust/Disintegration" Animation Variants ---
  const dustVariants = {
    initial: { 
      opacity: 0, 
      scale: 1.1, 
      filter: "blur(20px)" 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      x: 100, // Moves right as if blown by wind
      filter: "blur(15px) grayscale(100%)", // Turns grey and blurry (dust look)
      transition: { duration: 1.2, ease: "easeInOut" }
    }
  };

  // Particle overlay for "dust" effect
  const ParticleOverlay = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 mix-blend-overlay">
      <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 font-serif relative">
      
      {/* Import Bengali Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Cinzel:wght@400;700&display=swap');`}
      </style>

      {/* Main Invitation Card */}
      <div className="relative w-full max-w-md md:max-w-lg h-[800px] bg-[#FFF8E7] rounded-xl shadow-2xl overflow-hidden border-8 border-double border-[#8B4513]">
        
        {/* Decorative Border Frame */}
        <div className="absolute inset-2 border border-[#DAA520] rounded-lg opacity-60 pointer-events-none z-20"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#006a4e] via-[#f42a41] to-[#006a4e] z-20"></div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={slides[currentIndex].id}
            variants={dustVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
          >
            <ParticleOverlay />

            {/* ---------------- SLIDE CONTENT RENDERER ---------------- */}
            
            {/* TYPE 1: LETTER / TEXT SLIDE */}
            {slides[currentIndex].type === 'text' && (
              <div className="flex flex-col h-full p-8 text-[#2c1810]">
                {/* Logos Header */}
                <div className="flex justify-between items-center mb-6 border-b border-[#DAA520] pb-4">
                  {slides[currentIndex].content.logos.map((logo, idx) => (
                    <div key={idx} className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 p-1">
                      <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>

                {/* Main Letter */}
                <div className="flex-1 flex flex-col justify-center space-y-4 text-center">
                  <h1 className="text-3xl font-bold text-[#8B4513] font-['Noto_Serif_Bengali'] mb-2 decoration-wavy underline decoration-[#DAA520]">
                    {slides[currentIndex].content.title}
                  </h1>
                  
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-2 text-[#DAA520] opacity-30 w-8 h-8 transform -scale-x-100" />
                    <p className="text-sm md:text-base leading-relaxed text-justify font-['Noto_Serif_Bengali'] text-gray-800 px-2">
                      {slides[currentIndex].content.body.split('\n').map((line, i) => (
                        <span key={i} className="block mb-2">{line}</span>
                      ))}
                    </p>
                    <Quote className="absolute -bottom-4 -right-2 text-[#DAA520] opacity-30 w-8 h-8" />
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-auto pt-6 text-right">
                  <p className="text-lg font-bold text-[#006a4e] font-['Noto_Serif_Bengali'] whitespace-pre-line">
                    {slides[currentIndex].content.signature}
                  </p>
                </div>
              </div>
            )}

            {/* TYPE 2: IMAGE / PRODUCT SLIDE */}
            {slides[currentIndex].type === 'image' && (
              <div className="flex flex-col h-full">
                {/* Image Container */}
                <div className="h-[65%] w-full relative overflow-hidden bg-black">
                   <img 
                    src={slides[currentIndex].image} 
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-cover opacity-90"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810] to-transparent opacity-80"></div>
                   
                   {/* Floating Label */}
                   <div className="absolute bottom-6 left-0 right-0 text-center">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block px-6 py-2 border-t-2 border-b-2 border-[#DAA520]"
                      >
                        <h2 className="text-4xl text-[#FFF8E7] font-['Noto_Serif_Bengali'] font-bold drop-shadow-lg">
                          {slides[currentIndex].title}
                        </h2>
                      </motion.div>
                   </div>
                </div>

                {/* Text Container */}
                <div className="h-[35%] flex flex-col items-center justify-center bg-[#2c1810] text-[#FFF8E7] p-6 text-center relative">
                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#DAA520] p-2 rounded-full shadow-lg">
                     <Star className="w-6 h-6 text-[#2c1810]" fill="currentColor" />
                   </div>
                   
                   <h3 className="text-2xl font-['Cinzel'] text-[#DAA520] tracking-widest mb-2 uppercase">
                     {slides[currentIndex].subTitle}
                   </h3>
                   <p className="font-['Noto_Serif_Bengali'] text-gray-300 text-sm font-light">
                     {slides[currentIndex].desc}
                   </p>
                   
                   <div className="mt-4 flex gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse"></span>
                     <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse delay-100"></span>
                     <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse delay-200"></span>
                   </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- AI FEATURE FLOATING BUTTON --- */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-50 group border-2 border-amber-300"
        title="Create Personalized Invitation"
      >
        <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12" />
      </button>

      {/* --- AI MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFF8E7] w-full max-w-md rounded-2xl p-6 shadow-2xl border-4 border-[#8B4513] relative overflow-hidden"
            >
              {/* Modal Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
              
              {/* Modal Header */}
              <div className="relative z-10 flex justify-between items-center mb-6 border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2 text-[#8B4513]">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold font-['Noto_Serif_Bengali']">আমন্ত্রণ বার্তা তৈরি করুন</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="relative z-10 space-y-4">
                {!generatedInvite ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 font-['Noto_Serif_Bengali']">
                        অতিথির নাম (Guest Name):
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="উদাঃ শ্রদ্ধেয় শিক্ষক, প্রিয় বন্ধু..."
                        className="w-full p-3 border-2 border-amber-200 rounded-lg bg-white focus:border-amber-500 focus:outline-none font-['Noto_Serif_Bengali']"
                      />
                    </div>

                    <button
                      onClick={generateAIInvite}
                      disabled={isGenerating || !guestName.trim()}
                      className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                        isGenerating || !guestName.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#006a4e] to-[#004d38] hover:shadow-lg hover:scale-[1.02]'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span className="font-['Noto_Serif_Bengali']">লিখছি...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-['Noto_Serif_Bengali']">বার্তা তৈরি করুন ✨</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-inner relative">
                       <Quote className="w-6 h-6 text-amber-200 absolute top-2 left-2 transform -scale-x-100" />
                       <p className="text-[#2c1810] text-center font-['Noto_Serif_Bengali'] whitespace-pre-wrap leading-relaxed pt-4 pb-2 px-2">
                         {generatedInvite}
                       </p>
                       <Quote className="w-6 h-6 text-amber-200 absolute bottom-2 right-2" />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setGeneratedInvite('')}
                        className="flex-1 py-2 border-2 border-amber-600 text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors font-['Noto_Serif_Bengali']"
                      >
                        নতুন বার্তা
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 font-['Noto_Serif_Bengali']"
                      >
                        <Copy className="w-4 h-4" />
                        কপি করুন
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded font-['Noto_Serif_Bengali']">
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
