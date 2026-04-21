import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#001f3f] border-t border-white/10 pt-20 pb-10 text-white">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter">
              EduFlex<span className="text-brand-400 font-light ml-0.5">.</span>
            </Link>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Empowering the next generation of digital professionals through world-class education and expert mentorship.
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">f</div>
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">t</div>
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors">in</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-sm text-neutral-300 hover:text-brand transition-colors">Browse Courses</Link></li>
              <li><Link to="/register" className="text-sm text-neutral-300 hover:text-brand transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="text-sm text-neutral-300 hover:text-brand transition-colors">Student Login</Link></li>
              <li><Link to="/profile" className="text-sm text-neutral-300 hover:text-brand transition-colors">Instructor Workspace</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Resources</h4>
            <ul className="space-y-4">
              <li className="text-sm text-neutral-300 hover:text-brand cursor-pointer transition-colors">Documentation</li>
              <li className="text-sm text-neutral-300 hover:text-brand cursor-pointer transition-colors">Help Center</li>
              <li className="text-sm text-neutral-300 hover:text-brand cursor-pointer transition-colors">Terms of Service</li>
              <li className="text-sm text-neutral-300 hover:text-brand cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="text-sm text-neutral-300">support@eduflex.com</li>
              <li className="text-sm text-neutral-300">+1 (555) 000-1234</li>
              <li className="text-sm text-neutral-300">123 Learning Ave, <br />Future City, VC 101</li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
             © 2026 EduFlex. All rights reserved.
           </p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <span className="hover:text-white cursor-pointer transition-colors">English</span>
              <span className="hover:text-white cursor-pointer transition-colors">Arabic</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
