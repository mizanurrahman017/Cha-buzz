import React from "react";
import {
  FaCoffee,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F7F5EF] border-t border-[#D8D5CC]">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ================= BRAND ================= */}
          <div>
            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 rounded-full bg-[#252525] text-[#F7F5EF] flex items-center justify-center">
                <FaCoffee />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-wider text-[#252525]">
                  CHA BUZZ
                </h2>

                <p className="text-[9px] tracking-[0.2em] text-[#8A806B]">
                  CAFE & RESTAURANT
                </p>
              </div>

            </div>

            <p className="text-sm leading-7 text-[#6F6B61] max-w-xs">
              Fresh food, refreshing tea, and a cozy place to enjoy every
              moment. Order your favorite food easily from Cha Buzz.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#D8D5CC] flex items-center justify-center text-[#252525] hover:bg-[#252525] hover:text-white transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#D8D5CC] flex items-center justify-center text-[#252525] hover:bg-[#252525] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#D8D5CC] flex items-center justify-center text-[#252525] hover:bg-[#252525] hover:text-white transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>

            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="text-base font-bold text-[#252525] mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="/"
                  className="text-sm text-[#6F6B61] hover:text-[#A08E65] transition"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/menu"
                  className="text-sm text-[#6F6B61] hover:text-[#A08E65] transition"
                >
                  Our Menu
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="text-sm text-[#6F6B61] hover:text-[#A08E65] transition"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="text-sm text-[#6F6B61] hover:text-[#A08E65] transition"
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="/orders"
                  className="text-sm text-[#6F6B61] hover:text-[#A08E65] transition"
                >
                  My Orders
                </a>
              </li>

            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-base font-bold text-[#252525] mb-5">
              Contact Us
            </h3>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#A08E65]" />

                <p className="text-sm leading-6 text-[#6F6B61]">
                  Amberkhana,
                  <br />
                  Sylhet, Bangladesh
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#A08E65]" />

                <p className="text-sm text-[#6F6B61]">
                  +880 1XXXXXXXXX
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#A08E65]" />

                <p className="text-sm text-[#6F6B61]">
                  hello@chabuzz.com
                </p>
              </div>

            </div>
          </div>

          {/* ================= OPENING HOURS ================= */}
          <div>
            <h3 className="text-base font-bold text-[#252525] mb-5">
              Opening Hours
            </h3>

            <div className="flex items-start gap-3 mb-5">
              <FaClock className="mt-1 text-[#A08E65]" />

              <div className="text-sm text-[#6F6B61] leading-7">
                <p>
                  <span className="font-medium text-[#252525]">
                    Saturday - Thursday
                  </span>
                  <br />
                  10:00 AM - 10:00 PM
                </p>

                <p className="mt-2">
                  <span className="font-medium text-[#252525]">
                    Friday
                  </span>
                  <br />
                  02:00 PM - 10:00 PM
                </p>
              </div>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ECE9DF]">
              <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>

              <span className="text-xs font-medium text-[#555147]">
                Open Today
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM FOOTER ================= */}
      <div className="border-t border-[#D8D5CC]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-xs sm:text-sm text-[#8A867C] text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-[#252525]">
                Cha Buzz
              </span>
              . All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-xs sm:text-sm text-[#8A867C]">
              <a
                href="/privacy"
                className="hover:text-[#A08E65] transition"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="hover:text-[#A08E65] transition"
              >
                Terms & Conditions
              </a>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;