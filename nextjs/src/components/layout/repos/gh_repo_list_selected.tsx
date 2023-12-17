import AlertResponse from "@/components/layout/alert_response";
import { IGithubRepository } from "@/types/repository";
import { Dialog, Transition } from "@headlessui/react";
import { RepoTemplateIcon } from "@primer/octicons-react";
import { AxiosResponse } from "axios";
import { uniqueId } from "lodash";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = { open: boolean; setOpen: (...args: any) => any };

export default function GhSelectedRepos({ open, setOpen }: Props) {
    const [_, setSelectedRepos] = useLocalStorage<IGithubRepository[]>("selected-repos", []);
    const [selectedGhRepos, setSelectedGHRepos] = useLocalStorage<IGithubRepository[]>("selected-gh-repos", []);
    const [response, setResponse] = useState<AxiosResponse | null>(null);

    const cancelButtonRef = useRef(null);

    const bulkPush = () => {
        setSelectedRepos((_) => [..._, ...selectedGhRepos]);
        setSelectedGHRepos([]);
    };

    const removeRepo = (index: number) => {
        const snapshot = [...selectedGhRepos];
        snapshot.splice(index, 1);
        setSelectedGHRepos((_) => [...snapshot]);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const changeResponse = () => setResponse(null);

        intervalId = setInterval(changeResponse, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [response]);

    const hasContent = useMemo(() => selectedGhRepos.length > 0, [selectedGhRepos.length]);

    return (
        <Transition.Root
            show={open}
            as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl sm:p-6">
                                <AlertResponse
                                    response={response}
                                    callback={() => setResponse(null)}
                                />
                                <div className="mt-3">
                                    {hasContent ? (
                                        <div className="">
                                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                                {selectedGhRepos.map((repo: any, repoIdx: number) => (
                                                    <li
                                                        key={uniqueId("current-repo")}
                                                        className="ring-1 ring-inset ring-gray-200 rounded-md px-3.5 py-2 hover:bg-gray-50 hover:cursor-pointer">
                                                        <a
                                                            href="#"
                                                            className="flex items-center"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeRepo(repoIdx);
                                                            }}>
                                                            <div className="h-11 w-11 flex-shrink-0">
                                                                <img
                                                                    className="h-11 w-11 rounded-full"
                                                                    src={repo.owner.avatar_url}
                                                                    alt={repo.owner.login}
                                                                />
                                                            </div>
                                                            <div className="ml-4 truncate">
                                                                <div className="font-medium text-gray-900 truncate min-w-0">
                                                                    {repo.name}
                                                                </div>
                                                                <div className="text-gray-500 truncate">
                                                                    @{repo.owner.login}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-3 sm:gap-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center col-span-1 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:col-start-3"
                                                    onClick={bulkPush}>
                                                    Push
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center col-span-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-rose-900 shadow-sm ring-1 ring-inset ring-rose-300 hover:bg-rose-50 sm:col-start-2 sm:mt-0"
                                                    onClick={() => setSelectedGHRepos([])}>
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center col-span-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                    onClick={() => setOpen(false)}
                                                    ref={cancelButtonRef}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <RepoTemplateIcon
                                                size={16}
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No repos</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Get start by selecting a repository.
                                            </p>
                                            <div className="mt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen(false)}
                                                    className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
