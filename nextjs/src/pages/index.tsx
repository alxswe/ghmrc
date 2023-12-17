import { features, team, techStack } from "@/components/constants";
import Page from "@/components/layout/motion/page";
import WavyText from "@/components/motion/wavy-text";
import { getServerAuthSession } from "@/server/auth";
import { MarkGithubIcon } from "@primer/octicons-react";
import { motion } from "framer-motion";
import { sanitize } from "isomorphic-dompurify";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const Slider = ({ images = [] }: { images: { name: string; imageUrl: string }[] }) => {
    useEffect(() => {
        const scrollers = document.querySelectorAll(".scroller");

        // If a user hasn't opted in for recuded motion, then we add the animation
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                // add data-animated="true" to every `.scroller` on the page
                scroller.setAttribute("data-animated", "true");

                // Make an array from the elements within `.scroller-inner`
                const scrollerInner = scroller.querySelector(".scroller__inner");
                // @ts-expect-error: 'scrollerInner' is possibly 'null'.ts(18047)
                const scrollerContent = Array.from(scrollerInner.children);

                // For each item in the array, clone it
                // add aria-hidden to it
                // add it into the `.scroller-inner`
                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    // @ts-expect-error: Property 'setAttribute' does not exist on type 'Node'.ts(2339)
                    duplicatedItem.setAttribute("aria-hidden", true);
                    //@ts-expect-error: 'scrollerInner' is possibly 'null'.ts(18047)
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }
    }, []);

    return (
        <div
            className="scroller"
            data-speed="fast">
            <ul className="grid gap-4 space-x-8 scroller__inner">
                {images.map((image) => (
                    <li
                        key={image.name}
                        className="flex items-center justify-center">
                        <img
                            className="h-24 px-4 w-full object-contain object-center mix-blend-multiply"
                            src={image.imageUrl}
                            alt={image.name}
                            width={158}
                            height={48}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function HomePage({ session }: { session: Session }) {
    return (
        <Page>
            <Head>
                <title>Home | GHMRC</title>
            </Head>
            {/* Header */}
            <motion.main
                layout
                className="isolate">
                {/* Hero section */}
                <div className="relative pt-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, type: "tween" }}
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true">
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                        />
                    </motion.div>
                    <motion.div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <motion.div className="mx-auto max-w-2xl text-center">
                                <motion.h1 className="inline-flex space-x-4 justify-center items-center text-2xl lg:text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 1.5,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 8,
                                        }}>
                                        Select
                                    </motion.span>
                                    <motion.svg
                                        initial={{ opacity: 0, y: -100 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 1,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 8,
                                        }}
                                        className="h-2 w-2 fill-indigo-600"
                                        viewBox="0 0 6 6"
                                        aria-hidden="true">
                                        <circle
                                            cx={3}
                                            cy={3}
                                            r={3}
                                        />
                                    </motion.svg>{" "}
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 2,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 8,
                                        }}
                                        className="!text-indigo-600">
                                        Clone
                                    </motion.span>
                                    <motion.svg
                                        initial={{ opacity: 0, y: -100 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 1,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 8,
                                        }}
                                        className="h-2 w-2 fill-indigo-600"
                                        viewBox="0 0 6 6"
                                        aria-hidden="true">
                                        <circle
                                            cx={3}
                                            cy={3}
                                            r={3}
                                        />
                                    </motion.svg>
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 2.5,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 8,
                                        }}>
                                        Download
                                    </motion.span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 2.5,
                                        duration: 0.5,
                                        type: "tween",
                                    }}
                                    className="mt-6 text-lg leading-8 text-gray-600 text-center">
                                    <strong>GHMRC</strong>, or <strong>GitHub Multi-Repository Cloner</strong>, is a
                                    versatile web application designed to streamline the process of cloning multiple
                                    GitHub repositories effortlessly. This tool caters to developers and teams working
                                    on projects that involve multiple repositories by providing a centralized platform
                                    for managing cloning tasks.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 100 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 2.5, duration: 0.5, type: "spring", stiffness: 100 }}
                                    className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link
                                        href="/cloner"
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Get started
                                    </Link>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 2.5, duration: 0.5, type: "tween" }}
                                className="mt-16 flow-root sm:mt-24">
                                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img
                                        src="assets/home_page_image_1.png"
                                        alt="App screenshot"
                                        width={2432}
                                        height={1442}
                                        className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, type: "tween" }}
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true">
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                        />
                    </motion.div>
                </div>

                {/* Logo cloud */}
                <div
                    id="stack"
                    className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "tween" }}
                        className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Code better</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Powered By</p>
                    </motion.div>
                    <motion.div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <Slider images={techStack} />
                                            </motion.div>
                </div>

                {/* Feature section */}
                <div
                    id="features"
                    className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "tween" }}
                        className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Clone faster</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Features</p>
                    </motion.div>
                    <motion.div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <motion.dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {features.map((feature, featureIdx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: featureIdx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, type: "tween" }}
                                    viewport={{ once: true }}
                                    key={feature.name}
                                    className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                            <feature.icon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">
                                        <span
                                            className="text-justify"
                                            dangerouslySetInnerHTML={{ __html: sanitize(feature.description) }}
                                        />
                                    </dd>
                                </motion.div>
                            ))}
                        </motion.dl>
                    </motion.div>
                </div>

                {/* Team section */}
                <div className="bg-white py-24 md:py-32">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
                        <div className="max-w-2xl xl:col-span-2">
                            <WavyText
                                text="About the team"
                                className="text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl"
                            />

                            {/* </WavyText> */}
                            <motion.p
                                initial={{ opacity: 0, height: "0%" }}
                                whileInView={{ opacity: 1, height: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, type: "tween" }}
                                className="mt-6 text-lg leading-8 text-gray-600">
                                We’re a dynamic group of individuals who are passionate about what we do and dedicated
                                to delivering the best results for our clients.
                                <br />
                                <br />
                                Recognizing the challenges faced in sharing and comparing code across multiple GitHub
                                repositories, we have decided to forge a solution. What brought GHMRC to light was its
                                purpose—to facilitate the exchange of ideas and foster a culture of learning.
                                <br />
                                <br />
                                This tool allowes developers to effortlessly clone their peers&apos; repositories,
                                unlocking a world of diverse coding styles and design patterns.
                            </motion.p>
                        </div>
                        <motion.ul className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3">
                            {team.map((person, personIdx) => (
                                <motion.li
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, type: "tween" }}
                                    key={person.name}
                                    className="relative flex flex-col gap-10 pt-12 sm:flex-row">
                                    <motion.div
                                        initial={{ opacity: 0, rotate: 0 }}
                                        whileInView={{ opacity: 1, rotate: 6 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 100 }}
                                        className="absolute origin-top-right inset-0 mix-blend-multiply backdrop-brightness-110 top-14 left-4 bg-white aspect-[4/5] w-52 flex-none rounded-2xl shadow ring-1 ring-inset ring-gray-200 rotate-6"
                                    />
                                    <motion.img
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, type: "tween" }}
                                        className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover object-center"
                                        src={person.imageUrl}
                                        alt={person.name}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 0.5, type: "tween" }}
                                        className="max-w-xl flex-auto">
                                        <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                                            {person.name}
                                        </h3>
                                        <p className="text-base leading-7 text-gray-600">{person.role}</p>
                                        <p className="mt-6 text-base leading-7 text-gray-600">{person.bio}</p>
                                        <ul className="mt-6 flex items-center gap-x-6">
                                            <li>
                                                <a
                                                    href={person.twitterUrl}
                                                    target="_blank"
                                                    referrerPolicy="no-referrer"
                                                    className="text-gray-400 hover:text-gray-500"
                                                    rel="noreferrer">
                                                    <span className="sr-only">Twitter</span>
                                                    <svg
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={person.linkedinUrl}
                                                    target="_blank"
                                                    referrerPolicy="no-referrer"
                                                    className="text-gray-400 hover:text-gray-500"
                                                    rel="noreferrer">
                                                    <span className="sr-only">LinkedIn</span>
                                                    <svg
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={person.githubUrl}
                                                    target="_blank"
                                                    referrerPolicy="no-referrer"
                                                    className="text-gray-400 hover:text-gray-500"
                                                    rel="noreferrer">
                                                    <span className="sr-only">Github</span>
                                                    <MarkGithubIcon
                                                        size={26}
                                                        className="h-5 w-5"
                                                    />
                                                </a>
                                            </li>
                                        </ul>
                                    </motion.div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </div>
            </motion.main>

            {/* Footer */}
        </Page>
    );
}

export const getServerSideProps = async (context: { req: NextApiRequest; res: NextApiResponse }) => {
    const session = await getServerAuthSession(context);
    return { props: { session } };
};
