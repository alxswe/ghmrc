import clsx from "clsx";
import { Variants, motion } from "framer-motion";
import { uniqueId } from "lodash";

export default function WavyText({ as, text, className, delay = 0, duration = 0.05, ...props }: any) {
    const letters: string[] = Array.from(text);
    const container: Variants = {
        hidden: {
            opacity: 0,
        },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: duration, delayChildren: i * delay },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    let Component = as ?? motion.h5

    return (
        <Component
            className={clsx(className, "flex overflow-hidden")}
            variants={container}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
            {...props}>
            {letters.map((letter, index) => (
                <motion.span
                    key={uniqueId(String(index))}
                    variants={child}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </Component>
    );
}
