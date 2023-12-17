import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { uniqueId } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useLocalStorage } from "usehooks-ts";

const navigation: { name: string; href: string; current?: boolean }[] = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Cloner",
        href: "/cloner",
    },
    {
        name: "Support",
        href: "/support",
    },
];

export default function UINavbar(props: any) {
    const pathname = usePathname();
    const [_, setShowCenter] = useLocalStorage("show-center", false);
    const { data: session } = useSession();

    return (
        <Disclosure
            as="nav"
            className="bg-white shadow UINavbar sticky top-0 z-20">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex px-2 lg:px-0">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                                    {navigation.map((item) => {
                                        item.current = pathname === item.href;
                                        return (
                                            <Link
                                                key={uniqueId(item.href)}
                                                href={item.href}
                                                className={clsx(
                                                    item.current
                                                        ? "border-indigo-500 text-gray-900"
                                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                                                )}>
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                                {props.search && (
                                    <div className="w-full max-w-lg lg:max-w-xs">
                                        <label
                                            htmlFor="search"
                                            className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <input
                                                id="search"
                                                name="search"
                                                className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Search"
                                                type="search"
                                                value={props.search?.value}
                                                onChange={props.search?.onChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden lg:ml-4 lg:flex lg:items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowCenter(true)}
                                    className="relative mr-4 flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>

                                {/* Profile dropdown */}
                                {session?.key ? (
                                    <Menu
                                        as="div"
                                        className="relative  flex-shrink-0">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={session?.profile?.avatar_url}
                                                    alt={session?.profile?.login}
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95">
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            type="button"
                                                            onClick={() => signOut({ redirect: false })}
                                                            className={clsx(
                                                                active ? "bg-gray-100" : "",
                                                                "inline-flex items-center w-full px-4 py-2 text-sm text-gray-700"
                                                            )}>
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => signIn("github", { redirect: false })}
                                        className="text-sm font-semibold leading-6 text-gray-900">
                                        Log in <span aria-hidden="true">&rarr;</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => {
                                item.current = pathname === item.href;
                                return (
                                    <Disclosure.Button
                                        key={uniqueId(item.name)}
                                        as={Link}
                                        href={item.href}
                                        className={clsx(
                                            item.current
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                                            "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium"
                                        )}>
                                        {item.name}
                                    </Disclosure.Button>
                                );
                            })}
                        </div>
                        <div className="border-t border-gray-200 pb-3 pt-4">
                            {session?.key ? (
                                <>
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={session?.profile?.avatar_url}
                                                alt={session?.profile?.login}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">
                                                {session?.profile?.login}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {session?.profile?.email}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowCenter(true)}
                                            className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <Disclosure.Button
                                            as="button"
                                            onClick={() => signOut({ redirect: false })}
                                            className="inline-flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                                            Sign out
                                        </Disclosure.Button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => signIn("github", { redirect: false })}
                                    className="inline-flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                                    Log in
                                </button>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
