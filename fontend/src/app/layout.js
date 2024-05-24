import { Inter } from "next/font/google";
import "./globals.css";
import RecoidContextProvider from "./recoilProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interior",
  description: "Furniture management warehouse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RecoidContextProvider>{children}</RecoidContextProvider>
      </body>
    </html>
  );
}
