import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
// ami
import { useLanguage } from "../../../Context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#F7F3EC] border-t border-[#DCCDBB]">

      {/* ================= MAIN FOOTER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 sm:gap-8 lg:gap-10">

          {/* ================= BRAND ================= */}

          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">

              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full overflow-hidden">
                <img
                  src="/cha buzz logo.jpg"
                  alt="Cha Buzz Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-wider text-[#5A2E16]">
                  CHAA BUZZ
                </h2>
              </div>

            </div>

            <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-[#7A6A5C] max-w-xs">
              {t("freshFoodDescription")}
            </p>

            {/* Social Icons */}

            <div className="flex items-center gap-2.5 mt-4 sm:mt-5">

              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xs sm:text-sm" />
              </a>

              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xs sm:text-sm" />
              </a>

              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xs sm:text-sm" />
              </a>

            </div>
          </div>

          {/* ================= QUICK LINKS + CONTACT ================= */}

          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:contents">

            {/* ================= QUICK LINKS ================= */}

            <div>

              <h3 className="text-sm sm:text-base font-bold text-[#5A2E16] mb-3 sm:mb-5">
                {t("quickLinks")}
              </h3>

              <ul className="space-y-2 sm:space-y-3">

                <li>
                  <a
                    href="/"
                    className="text-xs sm:text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                  >
                    {t("home")}
                  </a>
                </li>

                <li>
                  <a
                    href="/menu"
                    className="text-xs sm:text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                  >
                    {t("ourMenu")}
                  </a>
                </li>

                <li>
                  <a
                    href="/about"
                    className="text-xs sm:text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                  >
                    {t("aboutUs")}
                  </a>
                </li>

                <li>
                  <a
                    href="/contact"
                    className="text-xs sm:text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                  >
                    {t("contactUs")}
                  </a>
                </li>

                <li>
                  <a
                    href="/orders"
                    className="text-xs sm:text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                  >
                    {t("myOrders")}
                  </a>
                </li>

              </ul>

            </div>

            {/* ================= CONTACT ================= */}

            <div>

              <h3 className="text-sm sm:text-base font-bold text-[#5A2E16] mb-3 sm:mb-5">
                {t("contact")}
              </h3>

              <div className="space-y-3 sm:space-y-4">

                {/* Address */}

                <div className="flex items-start gap-2.5">

                  <FaMapMarkerAlt className="mt-1 text-[#8B4F26] text-xs sm:text-sm shrink-0" />

                  <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-[#7A6A5C]">
                    Kuchai,
                    <br />
                    Sylhet, Bangladesh
                  </p>

                </div>

                {/* Phone */}

                <div className="flex items-center gap-2.5">

                  <FaPhoneAlt className="text-[#8B4F26] text-xs sm:text-sm shrink-0" />

                  <p className="text-xs sm:text-sm text-[#7A6A5C]">
                    +880 1XXXXXXXXX
                  </p>

                </div>

                {/* Email */}

                <div className="flex items-start gap-2.5">

                  <FaEnvelope className="mt-1 text-[#8B4F26] text-xs sm:text-sm shrink-0" />

                  <p className="text-xs sm:text-sm text-[#7A6A5C] break-all">
                    hello@chabuzz.com
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= OPENING HOURS ================= */}

          <div>

            <h3 className="text-sm sm:text-base font-bold text-[#5A2E16] mb-3 sm:mb-5">
              {t("openingHours")}
            </h3>

            <div className="flex items-start gap-2.5 mb-4">

              <FaClock className="mt-1 text-[#8B4F26] text-xs sm:text-sm shrink-0" />

              <div className="text-xs sm:text-sm text-[#7A6A5C] leading-6 sm:leading-7">

                <p>

                  <span className="font-medium text-[#5A2E16]">
                    {t("saturdayThursday")}
                  </span>

                  <br />

                  10:00 AM - 10:00 PM

                </p>

                <p className="mt-1.5 sm:mt-2">

                  <span className="font-medium text-[#5A2E16]">
                    {t("friday")}
                  </span>

                  <br />

                  02:00 PM - 10:00 PM

                </p>

              </div>

            </div>

            {/* Open Today */}

            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#EDE3D6]">

              <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></span>

              <span className="text-[11px] sm:text-xs font-medium text-[#6B5A4B]">
                {t("openToday")}
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* ================= BOTTOM FOOTER ================= */}

      <div className="border-t border-[#DCCDBB]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">

            <p className="text-[11px] sm:text-xs md:text-sm text-[#9A8979] text-center md:text-left">

              © {new Date().getFullYear()}{" "}

              <span className="font-semibold text-[#5A2E16]">
                Cha Buzz
              </span>

              . {t("allRightsReserved")}

            </p>

            <div className="flex items-center gap-4 sm:gap-5 text-[11px] sm:text-xs md:text-sm text-[#9A8979]">

              <a
                href="/privacy"
                className="hover:text-[#8B4F26] transition"
              >
                {t("privacyPolicy")}
              </a>

              <a
                href="/terms"
                className="hover:text-[#8B4F26] transition"
              >
                {t("termsConditions")}
              </a>

            </div>

          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;