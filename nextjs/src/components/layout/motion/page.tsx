import Footer from "@/components/layout/motion/footer";
import Header from "@/components/layout/motion/header";

export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
