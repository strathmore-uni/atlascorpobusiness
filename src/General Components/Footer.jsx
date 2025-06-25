import React from 'react';
// import './footer.css'; // Removed old CSS
import { Link } from 'react-router-dom';
import FooterLinks from './Footer links/FooterLinks';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-2">Contact Us</h4>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">Spare Parts enquiries:</span><br />
              <a href="mailto:PTSUK.support@atlascopco.com" className="hover:underline text-blue-200">PTSUK.support@atlascopco.com</a>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Other enquiries:</span><br />
              <a href="mailto:power.technique.uk@atlascopco.com" className="hover:underline text-blue-200">power.technique.uk@atlascopco.com</a>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Website:</span><br />
              <a href="https://www.atlascopco.com/en-uk/construction-equipment" className="hover:underline text-blue-200" target="_blank" rel="noopener noreferrer">Construction Equipment UK</a>
            </div>
          </div>
        </div>
        {/* Company Info */}
        <div>
          <h4 className="text-lg font-bold mb-2">Atlas Copco Ltd T/A Atlas Copco Power Technique</h4>
          <div className="space-y-1 text-sm">
            <p>Registered office: Swallowdale Lane,</p>
            <p>Hemel Hempstead, Hertfordshire, HP2 7EA United Kingdom</p>
            <p>VAT Reg No: GB 207546371</p>
            <p>Company reg. no. 00159809</p>
            <p>Telephone: <a href="tel:01442 222 350" className="hover:underline text-blue-200">01442 222 350</a></p>
            <p>Opening Times: Monday - Friday 8:30am - 5:00pm</p>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-2">Quick Links</h4>
          <FooterLinks />
          <div className="flex gap-3 mt-4">
            <a href="https://www.facebook.com/atlascopco/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.75,9H13.5V7a1,1,0,0,1,1-1h2V3H14a4,4,0,0,0-4,4V9H8v3h2v9h3.5V12H16Z"></path></svg>
            </a>
            <a href="https://www.youtube.com/user/atlascopcogroup" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
            </a>
            <a href="https://twitter.com/atlascopco" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 56.693 56.693"><path d="M52.837,15.065c-1.811,0.805-3.76,1.348-5.805,1.591c2.088-1.25,3.689-3.23,4.444-5.592c-1.953,1.159-4.115,2-6.418,2.454  c-1.843-1.964-4.47-3.192-7.377-3.192c-5.581,0-10.106,4.525-10.106,10.107c0,0.791,0.089,1.562,0.262,2.303  c-8.4-0.422-15.848-4.445-20.833-10.56c-0.87,1.492-1.368,3.228-1.368,5.082c0,3.506,1.784,6.6,4.496,8.412  c-1.656-0.053-3.215-0.508-4.578-1.265c-0.001,0.042-0.001,0.085-0.001,0.128c0,4.896,3.484,8.98,8.108,9.91  c-0.848,0.23-1.741,0.354-2.663,0.354c-0.652,0-1.285-0.063-1.902-0.182c1.287,4.015,5.019,6.938,9.441,7.019  c-3.459,2.711-7.816,4.327-12.552,4.327c-0.815,0-1.62-0.048-2.411-0.142c4.474,2.869,9.786,4.541,15.493,4.541  c18.591,0,28.756-15.4,28.756-28.756c0-0.438-0.009-0.875-0.028-1.309C49.769,18.873,51.483,17.092,52.837,15.065z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/atlas-copco" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-blue-950 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-blue-100 gap-2">
          <a href="https://www.atlascopco.com/en-us/legal-notice" className="hover:underline">Legal Notice and Cookies</a>
          <span className="hidden md:inline">|</span>
          <span className="copy_footer">&copy;2024 Atlas Copco</span>
        </div>
      </div>
    </footer>
  );
}
