import { Repository } from "@/components/cache/db";
import { CacheContext } from "@/components/cache/provider";
import { axiosClient } from "@/components/client";
import AlertResponse from "@/components/layout/alert_response";
import TailwindMenu from "@/components/layout/menu";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { RepoIcon } from "@primer/octicons-react";
import { AxiosResponse } from "axios";
import clsx from "clsx";
import { uniqueId } from "lodash";
import { useSession } from "next-auth/react";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";

const RepoList = ({ repos }: { repos: Repository[] }) => {
    const { data: session } = useSession();
    const [response, setResponse] = useState<AxiosResponse | null>(null);

    const removeRepo = (repo: Repository) => {
        axiosClient
            .post("remove_repo", repo, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
            })
            .then((res) => setResponse(res))
            .catch((err) => setResponse(err.response));
    };

    const cloneRepo = (repo: Repository) => {
        axiosClient
            .post("clone_repo", repo, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
            })
            .then((res) => setResponse(res))
            .catch((err) => setResponse(err.response));
    };

    const downloadRepo = (repo: Repository) => {
        axiosClient
            .get<any>(
                "download_repo",
                { id: repo.pk },
                {
                    headers: {
                        Authorization: `Token ${session?.key}`,
                    },
                    responseType: "arraybuffer",
                },
            )
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/zip" }));
                const link = document.createElement("a");
                link.href = url;

                // Set the download attribute with the desired file name
                link.setAttribute("download", `${repo.owner}_${repo.name}.zip`);

                // Append the link to the body
                document.body.appendChild(link);

                // Trigger the click event to start the download
                link.click();

                // Remove the link from the body
                document.body.removeChild(link);
            })
            .catch((err) => setResponse(err.response));
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const changeResponse = () => {
            setResponse(null);
        };

        intervalId = setInterval(changeResponse, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [response]);

    const hasContent = useMemo(() => repos.length > 0, [repos.length]);

    return (
        <div className="flex-1 flex flex-col">
            <AlertResponse
                response={response}
                callback={() => setResponse(null)}
            />
            {hasContent ? (
                <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                    {repos.map((repo) => (
                        <li key={uniqueId(repo.name)}>
                            <div className="group relative flex items-center px-5 py-6">
                                <div className="-m-1 block flex-1 p-1">
                                    <div
                                        className="absolute inset-0 group-hover:bg-gray-50"
                                        aria-hidden="true"
                                    />
                                    <div className="relative flex min-w-0 flex-1 items-center">
                                        <div className="relative inline-block flex-shrink-0">
                                            {repo.avatar_url ? (
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={repo.avatar_url}
                                                    alt={repo.owner}
                                                />
                                            ) : (
                                                <span className="h-10 w-10 rounded-full">
                                                    <RepoIcon
                                                        size={16}
                                                        className=""
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                            <span
                                                className={clsx(
                                                    repo.is_cloned ? "bg-green-400" : "bg-gray-300",
                                                    "absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
                                                )}
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="ml-4 truncate">
                                            <p className="truncate text-sm font-medium text-gray-900">{repo.name}</p>
                                            <p className="truncate text-sm text-gray-500">{"@" + repo.owner}</p>
                                        </div>
                                    </div>
                                </div>
                                <TailwindMenu
                                    groups={[
                                        {
                                            name: "=",
                                            actions: [
                                                {
                                                    name: repo.is_cloned ? "Download" : "Clone",
                                                    onClick: () =>
                                                        repo.is_cloned ? downloadRepo(repo) : cloneRepo(repo),
                                                },

                                                {
                                                    name: "Remove",
                                                    onClick: () => removeRepo(repo),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="py-24">
                    <div className="grid place-items-center">
                        <div className="text-center">
                            <RepoIcon
                                size={24}
                                className="mx-auto h-12 w-12 text-gray-400"
                            />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No repositories</h3>
                            <p className="mt-1 text-sm text-gray-500">Check the other tabs for repositories.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

type Props = { open: boolean; setOpen: (...args: any) => any };

export default function SelectedRepos({ open, setOpen }: Props) {
    const { data: session } = useSession();

    const cache = useContext(CacheContext);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [response, setResponse] = useState<AxiosResponse | null>(null);
    const selectedRepos = useMemo(() => cache.repositories.filter((item) => !item.is_cloned), [cache.repositories]);
    const clonedRepos = useMemo(() => cache.repositories.filter((item) => item.is_cloned), [cache.repositories]);

    const tabs = useMemo(
        () => [
            { name: "All", href: "#", count: cache.repositories.length },
            { name: "To Clone", href: "#", count: selectedRepos.length },
            { name: "To Download", href: "#", count: clonedRepos.length },
        ],
        [cache.repositories.length, clonedRepos.length, selectedRepos.length],
    );

    const downloadAllRepos = () => {
        axiosClient
            .get<any>("download_repos", undefined, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
                responseType: "arraybuffer",
            })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/zip" }));
                const link = document.createElement("a");
                link.href = url;

                // Set the download attribute with the desired file name
                link.setAttribute("download", `${session?.profile?.login}.zip`);

                // Append the link to the body
                document.body.appendChild(link);

                // Trigger the click event to start the download
                link.click();

                // Remove the link from the body
                document.body.removeChild(link);
            })
            .catch((err) => setResponse(err.response));
    };

    const cloneAllRepos = () => {
        axiosClient
            .post("clone_repos", undefined, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
            })
            .then((res) => setResponse(res))
            .catch((err) => setResponse(err.response));
    };

    const clearAllRepos = () => {
        axiosClient
            .delete("clear_repos", undefined, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
            })
            .then((res) => setResponse(res))
            .catch((err) => setResponse(err.response));
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const changeResponse = () => {
            setResponse(null);
        };

        intervalId = setInterval(changeResponse, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [response]);

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
                </Transition.Child>

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
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="flex flex-1 flex-col overflow-y-scroll">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                        My Repositories
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

                                            <Tab.Group
                                                manual
                                                defaultIndex={0}
                                                selectedIndex={selectedIdx}
                                                onChange={setSelectedIdx}>
                                                <div className="border-b border-gray-200">
                                                    <div className="px-6">
                                                        <Tab.List
                                                            as="nav"
                                                            className="-mb-px flex space-x-6">
                                                            {tabs.map((tab) => (
                                                                <Tab
                                                                    key={tab.name}
                                                                    className={({ selected }) =>
                                                                        clsx(
                                                                            selected
                                                                                ? "border-indigo-500 text-indigo-600"
                                                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                                            "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium",
                                                                        )
                                                                    }>
                                                                    {tab.name}
                                                                    {tab.count ? (
                                                                        <span
                                                                            className={clsx(
                                                                                tab.count > 0
                                                                                    ? "bg-indigo-100 text-indigo-600"
                                                                                    : "bg-gray-100 text-gray-900",
                                                                                "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block",
                                                                            )}>
                                                                            {tab.count}
                                                                        </span>
                                                                    ) : null}
                                                                </Tab>
                                                            ))}
                                                        </Tab.List>
                                                    </div>
                                                </div>
                                                <AlertResponse
                                                    response={response}
                                                    callback={() => setResponse(null)}
                                                />
                                                <Tab.Panels
                                                    as="div"
                                                    className="min-h-full">
                                                    <Tab.Panel
                                                        as="div"
                                                        className="min-h-full flex flex-col">
                                                        <RepoList repos={cache.repositories} />
                                                    </Tab.Panel>
                                                    <Tab.Panel
                                                        as="div"
                                                        className="min-h-full flex flex-col">
                                                        <RepoList repos={selectedRepos} />
                                                    </Tab.Panel>
                                                    <Tab.Panel
                                                        as="div"
                                                        className="min-h-full flex flex-col">
                                                        <RepoList repos={clonedRepos} />
                                                    </Tab.Panel>
                                                </Tab.Panels>
                                            </Tab.Group>
                                        </div>
                                        <div className="flex-shrink-0 px-4 py-4">
                                            {selectedIdx === 0 && (
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={cloneAllRepos}
                                                        className="inline-flex items-center justify-center rounded-md bg-gray-600 w-full px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                                        Clone all
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={downloadAllRepos}
                                                        className="inline-flex items-center justify-center rounded-md bg-emerald-600 w-full px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                                        Download all
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={clearAllRepos}
                                                        className="inline-flex items-center justify-center rounded-md bg-rose-600 w-full px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
                                                        Clear
                                                    </button>
                                                </div>
                                            )}
                                            {selectedIdx === 1 && (
                                                <button
                                                    type="button"
                                                    onClick={cloneAllRepos}
                                                    className="rounded-md bg-gray-600 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                                    Clone all
                                                </button>
                                            )}
                                            {selectedIdx === 2 && (
                                                <button
                                                    type="button"
                                                    onClick={downloadAllRepos}
                                                    className="download rounded-md bg-emerald-600 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                                    Download all
                                                </button>
                                            )}
                                        </div>
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
