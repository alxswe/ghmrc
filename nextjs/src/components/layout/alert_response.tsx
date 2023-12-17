import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@primer/octicons-react";
import { AxiosResponse } from "axios";
import { isResponseFail, isResponseSuccessful } from "axios-clt";
import clsx from "clsx";
import { useMemo } from "react";

type Props = { response: AxiosResponse | null; callback?: (...args: any) => any };

export default function AlertResponse({ response, callback }: Props) {
    const success = useMemo(() => isResponseSuccessful(response), [response]);
    const error = useMemo(() => isResponseFail(response), [response]);

    console.log({ data: response?.data });

    const message = useMemo(
        () => response?.data?.detail ?? response?.data?.message ?? response?.statusText,
        [response?.data?.detail, response?.data?.message, response?.statusText],
    );

    return (
        <Transition
            appear
            show={Boolean(response)}
            as="div"
            className="">
            <div className={clsx(success && "bg-green-50", error && "bg-rose-50", "rounded-md p-4")}>
                <div className="flex">
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
                    <div className="ml-3">
                        <p
                            className={clsx(
                                success && "text-green-800",
                                error && "text-rose-800",
                                "text-sm font-medium ",
                            )}>
                            {message}
                        </p>
                    </div>
                    {callback && (
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    onClick={callback}
                                    className={clsx(
                                        success &&
                                            "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50",
                                        error &&
                                            "bg-rose-50 text-rose-500 hover:bg-rose-100 focus:ring-rose-600 focus:ring-offset-rose-50",
                                        "inline-flex rounded-md  p-1.5 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-green-50",
                                    )}>
                                    <span className="sr-only">Dismiss</span>
                                    <XMarkIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Transition>
    );
}
