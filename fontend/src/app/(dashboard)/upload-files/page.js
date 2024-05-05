"use client";
import UploadFileProduct from "./(component)/uploadFileProduct.js";
import { FaChevronLeft } from "react-icons/fa";
import { redirect, usePathname, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <div
        className="flex items-center mb-4 font-bold gap-2 cursor-pointer"
        onClick={() => router.back(-1)}
      >
        <FaChevronLeft />
        Nhập kho
      </div>
      <UploadFileProduct />
    </div>
  );
}
