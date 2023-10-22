// components/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white text-black shadow-lg">
      <div className="flex items-center">
        <div className="text-xl font-bold">GitaLearn</div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="border border-black p-2">Login</button>
      </div>
    </div>
  );
};

export default Header;
