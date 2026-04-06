import LoginHeader from "@/components/login/loginHeader";
import Loginform from "@/components/login/loginForm";
import FooterLayout from "@/components/layout/footerLayout";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export default function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoginHeader />
      <main
        className="flex-1 flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/60" />

        {/* Form sits above overlay */}

        <Loginform />
      </main>
      <FooterLayout />
    </div>
  );
}
