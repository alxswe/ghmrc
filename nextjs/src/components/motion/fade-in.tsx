import { motion } from "framer-motion";

export default function Fadein({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "tween" }}>
            {children}
        </motion.div>
    );
}
