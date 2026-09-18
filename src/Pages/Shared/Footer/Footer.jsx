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

import { useLanguage } from "../../../Context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#F7F3EC] border-t border-[#DCCDBB]">

      {/* ================= MAIN FOOTER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ================= BRAND ================= */}

          <div>
            <div className="flex items-center gap-3 mb-5">

              <div className="w-14 h-14 flex items-center rounded-full justify-center overflow-hidden">
                <img
                  src="/cha buzz logo.jpg"
                  alt="Cha Buzz Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-wider text-[#5A2E16]">
                  CHAA BUZZ
                </h2>
              </div>

            </div>

            <p className="text-sm leading-7 text-[#7A6A5C] max-w-xs">
              {t("freshFoodDescription")}
            </p>

            {/* Social Icons */}

            <div className="flex items-center gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#DCCDBB] flex items-center justify-center text-[#6B3D1F] hover:bg-[#8B4F26] hover:text-white hover:border-[#8B4F26] transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>

            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}

          <div>

            <h3 className="text-base font-bold text-[#5A2E16] mb-5">
              {t("quickLinks")}
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="/"
                  className="text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                >
                  {t("home")}
                </a>
              </li>

              <li>
                <a
                  href="/menu"
                  className="text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                >
                  {t("ourMenu")}
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                >
                  {t("aboutUs")}
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                >
                  {t("contactUs")}
                </a>
              </li>

              <li>
                <a
                  href="/orders"
                  className="text-sm text-[#7A6A5C] hover:text-[#8B4F26] transition"
                >
                  {t("myOrders")}
                </a>
              </li>

            </ul>
          </div>

          {/* ================= CONTACT ================= */}

          <div>

            <h3 className="text-base font-bold text-[#5A2E16] mb-5">
              {t("contact")}
            </h3>

            <div className="space-y-4">

              <div className="flex items-start gap-3">

                <FaMapMarkerAlt className="mt-1 text-[#8B4F26]" />

                <p className="text-sm leading-6 text-[#7A6A5C]">
                  Amberkhana,
                  <br />
                  Sylhet, Bangladesh
                </p>

              </div>

              <div className="flex items-center gap-3">

                <FaPhoneAlt className="text-[#8B4F26]" />

                <p className="text-sm text-[#7A6A5C]">
                  +880 1XXXXXXXXX
                </p>

              </div>

              <div className="flex items-center gap-3">

                <FaEnvelope className="text-[#8B4F26]" />

                <p className="text-sm text-[#7A6A5C]">
                  hello@chabuzz.com
                </p>

              </div>

            </div>
          </div>

          {/* ================= OPENING HOURS ================= */}

          <div>

            <h3 className="text-base font-bold text-[#5A2E16] mb-5">
              {t("openingHours")}
            </h3>

            <div className="flex items-start gap-3 mb-5">

              <FaClock className="mt-1 text-[#8B4F26]" />

              <div className="text-sm text-[#7A6A5C] leading-7">

                <p>

                  <span className="font-medium text-[#5A2E16]">
                    {t("saturdayThursday")}
                  </span>

                  <br />

                  10:00 AM - 10:00 PM

                </p>

                <p className="mt-2">

                  <span className="font-medium text-[#5A2E16]">
                    {t("friday")}
                  </span>

                  <br />

                  02:00 PM - 10:00 PM

                </p>

              </div>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EDE3D6]">

              <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>

              <span className="text-xs font-medium text-[#6B5A4B]">
                {t("openToday")}
              </span>

            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM FOOTER ================= */}

      <div className="border-t border-[#DCCDBB]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-xs sm:text-sm text-[#9A8979] text-center md:text-left">

              © {new Date().getFullYear()}{" "}

              <span className="font-semibold text-[#5A2E16]">
                Cha Buzz
              </span>

              . {t("allRightsReserved")}

            </p>

            <div className="flex items-center gap-5 text-xs sm:text-sm text-[#9A8979]">

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