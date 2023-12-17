import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { BellIcon as OutlineBellIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Cloner", href: "/cloner" },
    { name: "Support", href: "/support" },
];

export default function Header() {
    const [_, setOpen] = useLocalStorage("show-center", false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <motion.header className="absolute inset-x-0 top-0 z-20">
            <nav
                className="flex items-center justify-between p-6 lg:px-8"
                aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link
                        href="/"
                        className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt=""
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}>
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon
                            className="h-6 w-6"
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end z-0">
                    {session?.key ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(true);
                                }}
                                className="inline-flex items-center mr-4 rounded-full hover:bg-gray-50 text-gray-400 focus:ring-1 focus:ring-offset-2 focus:ring-gray-200 focus:ring-offset-gray-200 focus:outline-none">
                                <OutlineBellIcon className="h-8 w-8" />
                            </button>
                            <img
                                src={session?.profile?.avatar_url}
                                className="h-10 w-10 rounded-full bg-gray-50"
                                alt="profile"
                            />
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => signIn("github", { redirect: true }).then((result) => console.log(result))}
                            className="text-sm font-semibold leading-6 text-gray-900">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </button>
                    )}
                </div>
            </nav>
            <Transition.Root
                show={mobileMenuOpen}
                as={Fragment}>
                <Dialog
                    as="div"
                    className="lg:hidden"
                    onClose={setMobileMenuOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full">
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="-m-1.5 p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="py-6">
                                        {session?.key ? (
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-full mr-4">
                                                    <img
                                                        src={session?.profile?.avatar_url}
                                                        className="h-full w-full rounded-full bg-gray-50"
                                                        alt="profile"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-lg font-semibold text-gray-900">
                                                        {session?.profile?.login}
                                                    </h5>
                                                    <p className="text-sm font-medium text-gray-500">
                                                        {session?.profile.email}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpen(true);
                                                        }}
                                                        className="inline-flex items-center hover:bg-gray-50 text-gray-700 focus:ring-1 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-200 focus:outline-none">
                                                        <BellIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    signIn("github", { redirect: true }).then((result) =>
                                                        console.log(result),
                                                    )
                                                }
                                                className="-mx-3 inline-flex items-center w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                Log in
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
        </motion.header>
    );
}
