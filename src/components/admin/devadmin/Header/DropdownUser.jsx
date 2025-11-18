import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LuSettings } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import ClickOutside from "../../ClickOutside";
const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <div className="w-10 h-10 rounded-full border-gray-300 border flex items-center justify-center">
          <FaUserCircle size={32} color="#2367f8"/>
        </div>
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-4 mt-2 flex w-[250px] p-4 flex-col gap-2 rounded-lg border-[0.5px] border-gray-300 bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="">
            <span className="">
             Manage Admin
            </span>
          </div>
          <div className="">
            <button
              className="flex gap-2 items-center"
              onClick={() => signOut({ callbackUrl: '/signin' })}>
              <BiLogOut />
              Logout
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
