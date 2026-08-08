import {
  Globe ,
  Mail ,
  ThumbsUp,
} from "lucide-react";

const Footer = () => {
  return (
    <>
    <footer className="bg-slate-800 text-white px-8 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/favicon.png" className="text-xl w-6 h-6" />
        <h2 className="text-2xl font-bold">HealthConnect</h2>
      </div>
      <p className="mt-5 text-gray-400 leading-7">
        Empowering patients with secure, accessible health data
        management.
      </p>
      <div className="grid grid-cols-2 gap-10 mt-10">
        <div>
          <h3 className="uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Product
          </h3>

          <ul className="space-y-3">
            <li className="hover:text-blue-400 cursor-pointer">
              Storage
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Access Control
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Security
            </li>
          </ul>
        </div>

        <div>
          <h3 className="uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Company
          </h3>

          <ul className="space-y-3">
            <li className="hover:text-blue-400 cursor-pointer">
              About
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Privacy
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Contact
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 my-8"></div>
      <div className="flex justify-center gap-8 text-2xl">
        <Globe  className="cursor-pointer hover:text-blue-400 transition" />
        <Mail  className="cursor-pointer hover:text-blue-400 transition" />
        <ThumbsUp className="cursor-pointer hover:text-blue-400 transition" />
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-500 text-sm mt-8">
        © 2024 HealthConnect Inc. All rights reserved.
      </p>
     </footer>
    </>
  );
};

export default Footer;