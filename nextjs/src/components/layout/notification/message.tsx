import { Message } from "@/components/cache/db";
import { Transition } from "@headlessui/react";
import {
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { sanitize } from "isomorphic-dompurify";
import { Fragment, useEffect, useMemo } from "react";
import { useSessionStorage } from "usehooks-ts";

const data: Record<string, any> = {
    Info: {
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        icon: InformationCircleIcon,
    },
    Danger: {
        bgColor: "bg-rose-50",
        textColor: "text-rose-600",
        icon: ExclamationTriangleIcon,
    },
    Warning: {
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
        icon: ExclamationCircleIcon,
    },
    Success: {
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        icon: CheckCircleIcon,
    },
};

export default function AlertMessageNotification() {
    const [message, setMessage] = useSessionStorage<Message | null>("message", null);

    const Icon = useMemo(() => {
        if (message?.pk) {
            return data[message.type].icon;
        }

        return ArrowPathIcon;
    }, [message]);

    const textColor = useMemo(() => {
        if (message?.pk) {
            return data[message.type].textColor;
        }

        return "text-gray-400";
    }, [message]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        // Function to change the response
        const changeMessage = () => (message ? setMessage(null) : null);

        // Set up the interval to change the response every 5 seconds
        intervalId = setInterval(changeMessage, 5000);

        // Clean up the interval when the component unmounts or when text changes
        return () => {
            clearInterval(intervalId);
        };
    }, [message, setMessage]); // Effect will re-run if text changes

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50">
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                <Transition
                    show={Boolean(message)}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Icon
                                        className={`${textColor} h-5 w-5`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-semibold text-gray-900">{message?.title}</p>
                                    <p
                                        className="mt-1 text-sm text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitize(message?.content as string),
                                        }}
                                    />
                                </div>
                                <div className="ml-4 flex flex-shrink-0"></div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    );
}
