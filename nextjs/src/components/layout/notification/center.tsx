import { CacheContext } from "@/components/cache/provider";
import { Dialog, Transition } from "@headlessui/react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { sanitize } from "isomorphic-dompurify";
import { uniqueId } from "lodash";
import moment from "moment";
import { Fragment, useContext, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function NotificationCenter() {
    const [open, setOpen] = useLocalStorage("show-center", false);

    const cache = useContext(CacheContext);
    const hasContent = useMemo(() => cache.messages.length > 0, [cache.messages.length]);

    return (
        <Transition.Root
            show={open}
            as={Fragment}>
            <Dialog
                as="div"
                className="relative z-30"
                onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>{" "}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full">
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="p-6 border-b border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                    Notification Center
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                                        onClick={() => setOpen(false)}>
                                                        <span className="absolute -inset-2.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {hasContent ? (
                                            <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                                                {cache.messages.toReversed().map((item) => (
                                                    <li key={uniqueId(String(item.pk))}>
                                                        <div className="px-4 py-5">
                                                            <div className="flex items-center">
                                                                <p
                                                                    className={clsx(
                                                                        item.type === "Danger" && " text-rose-800",
                                                                        item.type === "Info" && " text-blue-800",
                                                                        item.type === "Success" && " text-emerald-800",
                                                                        item.type === "Warning" && " text-yellow-800",
                                                                        "truncate flex-1 text-sm font-semibold"
                                                                    )}>
                                                                    {item.title}
                                                                </p>
                                                                <p className="text-gray-500 text-xs">
                                                                    {moment(item.added_on).fromNow()}
                                                                </p>
                                                            </div>
                                                            <p
                                                                className="mt-3 text-sm text-gray-500 whitespace-pre-wrap break-words"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: sanitize(item.content),
                                                                }}
                                                            />
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="flex justify-center items-center flex-1 py-24">
                                                <div className="grid place-items-center">
                                                    <BellIcon
                                                        className="h-24 w-24 text-gray-500"
                                                        aria-hidden="true"
                                                    />
                                                    <p className="text-gray-900 font-medium text-lg">
                                                        No messages found.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
