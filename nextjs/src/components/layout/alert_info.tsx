import { Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";

export default function AlertCleanUpModal() {
    const [showCleanup, setShowCleanUp] = useSessionStorage("show-cleanup", true);
    const [hideForEver, setHideForEver] = useLocalStorage("hide-show-alert", false);

    return (
        <Transition
            as="div"
            appear
            show={hideForEver ? false : showCleanup}
            className="bg-blue-100 p-4">
            <div className="flex md:items-center">
                <div className="flex-shrink-0">
                    <InformationCircleIcon
                        className="h-5 w-5 text-blue-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between md:items-center">
                    <p className="text-sm text-blue-700">
                        Due to the limited resources on our server, repository selections will be cleared{" "}
                        <strong className="underline">everyday at 01:00 AM</strong>
                    </p>
                    <div className="mt-3 flex gap-x-1.5 text-sm md:ml-6 md:mt-0">
                        <button
                            onClick={() => setShowCleanUp(false)}
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm ring-1 ring-inset ring-blue-600 font-medium px-2 py-1 text-white">
                            Close
                        </button>
                        <button
                            onClick={() => setHideForEver(true)}
                            className="inline-flex items-center bg-rose-600 hover:bg-rose-700 rounded-md shadow-sm ring-1 ring-inset ring-rose-600 font-medium px-2 py-1 text-white">
                            Hide
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
