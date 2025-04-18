import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-[#a40145] text-white py-4 sm:py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0">
            <Image
              src="/asu_logo.png"
              alt="Arizona State University"
              width={180}
              height={45}
              className="brightness-[1.2] w-[140px] sm:w-[180px] h-auto"
            />
          </div>
          <div className="text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} Arizona State University. All rights reserved.</p>
            <div className="flex gap-3 sm:gap-4 mt-2 justify-center md:justify-end">
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                Terms of Use
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
