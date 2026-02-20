export function Footer() {
  return (
    // Replaced inline styles with Tailwind dark mode classes
    <footer className="py-8 mt-auto bg-slate-950 border-t border-emerald-500/20 text-slate-400 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h5 className="text-lg font-bold mb-3 text-slate-100">About Me</h5>
            <p className="text-sm opacity-80 leading-relaxed">
              Hi 👋 I&apos;m Aakash Kumar. This project is a personal bookmark & todo manager — designed to keep your favorite sites and daily tasks in one place.
            </p>
          </div>
          
          {/* Contact Section */}
          <div>
            <h5 className="text-lg font-bold mb-3 text-slate-100">Contact</h5>
            <p className="mb-2 flex items-center gap-2">
              <i className="bi bi-envelope" /> yourname@example.com
            </p>
            <p className="mb-2 flex items-center gap-2">
              <i className="bi bi-telephone" /> +91-98765-43210
            </p>
            <p className="flex items-center gap-2">
              <i className="bi bi-geo-alt" /> New Delhi, India
            </p>
          </div>
          
          {/* Social Links */}
          <div>
            <h5 className="text-lg font-bold mb-3 text-slate-100">Follow Me</h5>
            <nav className="flex gap-4 text-2xl" aria-label="Social Media Links">
              {/* Added target="_blank" and rel="noopener noreferrer" for security on external links */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors" aria-label="Twitter">
                <i className="bi bi-twitter" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="LinkedIn">
                <i className="bi bi-linkedin" />
              </a>
            </nav>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-8 pt-4 border-t border-emerald-500/10">
          <p className="mb-0 text-sm opacity-80">&copy; 2026 Aakash Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}