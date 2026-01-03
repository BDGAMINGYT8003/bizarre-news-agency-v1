import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-surface border-t border-white/5 pt-16 pb-8 mt-auto z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="space-y-4">
                         <h2 className="text-2xl font-bold text-white font-heading">আজগুবি<span className="text-purple-400">বার্তা</span></h2>
                         <p className="text-gray-400 text-sm leading-relaxed">
                             দেশের একমাত্র নির্ভরযোগ্য অনির্ভরযোগ্য সংবাদ মাধ্যম। আমরা সত্যের খুব কাছাকাছি যাই, কিন্তু স্পর্শ করি না।
                         </p>
                         <div className="flex space-x-4 pt-2">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300">
                                    <i className={`fa-brands fa-${social}`}></i>
                                </a>
                            ))}
                         </div>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold mb-6 font-heading">দ্রুত লিঙ্ক</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {['জনপ্রিয় সংবাদ', 'ভিডিও গ্যালারি', 'মতামত', 'আমাদের সম্পর্কে'].map(link => (
                                <li key={link}>
                                    <a href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                        <i className="fa-solid fa-chevron-right text-[10px] text-purple-500"></i> {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                         <h3 className="text-white font-bold mb-6 font-heading">নিউজলেটার</h3>
                         <p className="text-gray-400 text-sm mb-4">সবার আগে ভুয়া খবর পেতে সাবস্ক্রাইব করুন।</p>
                         <div className="flex">
                             <input type="email" placeholder="আপনার ইমেইল..." className="bg-black/30 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-purple-500 text-sm text-white" />
                             <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                                <i className="fa-solid fa-paper-plane"></i>
                             </button>
                         </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; ২০২৫ • আজগুবি বার্তা সংস্থা | সর্বস্বত্ব সংরক্ষিত (নয়)</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-300 transition-colors">গোপনীয়তা নীতি</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">শর্তাবলী</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;