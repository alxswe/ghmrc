import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@primer/octicons-react";
import { AxiosResponse } from "axios";
import { isResponseFail, isResponseSuccessful } from "axios-clt";
import { Fragment, useMemo } from "react";

type Props = { response: AxiosResponse | null; username: string };

export default function AlertNotification({ response, username }: Props) {
    const success = useMemo(() => isResponseSuccessful(response), [response]);
    const error = useMemo(() => isResponseFail(response), [response]);
    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6 z-50">
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                <Transition
                    show={Boolean(response)}
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
                                    {success && (
                                        <CheckCircleIcon
                                            className="h-5 w-5 text-green-400"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {error && (
                                        <ExclamationCircleIcon
                                            className="h-5 w-5 text-rose-400"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-semibold text-gray-900">{username ?? "Guest"}</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {response?.data?.detail ?? response?.data?.message ?? response?.statusText}
                                    </p>
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
