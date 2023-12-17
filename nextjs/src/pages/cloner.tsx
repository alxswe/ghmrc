import { CacheContext } from "@/components/cache/provider";
import { axiosClient, ghClient } from "@/components/client";
import { testRepos } from "@/components/constants";
import { isGHRepoSelected, isRepoSelected, makeServerRepo } from "@/components/constants/functions";
import TailwindMenu from "@/components/layout/menu";
import Page from "@/components/layout/motion/page";
import AlertNotification from "@/components/layout/notification/alert";
import CurrentSelectedRepos from "@/components/layout/repos/repo_list_selected";
import SelectedRepos from "@/components/layout/repos/repo_list_slide_over";
import { initialSearchRepoPageState, searchRepoPageReducer } from "@/components/reducers";
import { getServerAuthSession } from "@/server/auth";
import { IGithubRepository } from "@/types/repository";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon, RepoDeletedIcon, RepoIcon, RepoPushIcon } from "@primer/octicons-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { uniqueId } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import Head from "next/head";
import pluralize from "pluralize";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";

const order = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
];

const sort = [
    { label: "Best Match", value: "" },
    { label: "Stars", value: "stars" },
    { label: "Forks", value: "forks" },
    { label: "Last update", value: "updated" },
];

export const getServerSideProps = async (context: { req: NextApiRequest; res: NextApiResponse }) => {
    const session = await getServerAuthSession(context);
    return { props: { session } };
};

export default function Home({ session }: { session: Session | null }) {
    const [open, setOpen] = useState(false);
    const [showSelected, setShowSelected] = useState(false);
    const [state, dispatch] = useReducer(searchRepoPageReducer, initialSearchRepoPageState);

    const [_, setUpdateLimit] = useSessionStorage("update_limit", false);
    const [selectedGHRepos, setSelectedGHRepos] = useLocalStorage<IGithubRepository[]>("selected-gh-repos", []);

    const cache = useContext(CacheContext);

    const getRepos = useCallback(
        (_params?: Partial<typeof state.search>) => {
            const controller = new AbortController();

            const params = {
                ...state.search,
                ..._params,
            };

            const config = {
                params,
                signal: controller.signal,
                headers: {
                    Authorization: `Bearer ${session?.account?.access_token}`,
                },
            };

            dispatch({ type: "start_fetch" });

            ghClient
                .get<typeof state.repos_search | typeof state.repos_list>(
                    params.q === "" ? "repos" : "repos_search",
                    undefined,
                    config,
                )
                .then((res) => {
                    dispatch({
                        type: params.q === "" ? "finish_repos_list" : "finish_repos_search",
                        payload: res.data,
                    });
                })
                .catch((err) => dispatch({ type: "finish_fetch", payload: { responses: { fetch: err.response } } }))
                .finally(() => {
                    setUpdateLimit(true);
                });

            return () => {
                controller.abort();
            };
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.search.order, state.search.sort, state.search.page],
    );

    const timeout = useRef<any>();

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { currentTarget } = e,
            { value: q } = currentTarget;
        dispatch({ type: "set_search", payload: { q, page: 1 } });
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            getRepos({ q, page: 1 });
        }, 800);
    };

    const selectRepo = (repo: any) => {
        axiosClient
            .post<any>("repos", makeServerRepo(repo), { headers: { Authorization: `Token ${session?.key}` } })
            .then((res) => dispatch({ type: "finish_clone", payload: { responses: { clone: res } } }))
            .catch((err) => dispatch({ type: "finish_clone", payload: { responses: { clone: err.response } } }));
    };

    const removeRepo = (repo: any) => {
        const serverRepo = cache.repositories.find((elm) => elm.name === repo.name && elm.owner === repo.owner.login);

        axiosClient
            .post<any>("remove_repo", serverRepo, { headers: { Authorization: `Token ${session?.key}` } })
            .then((res) => dispatch({ type: "finish_clone", payload: { responses: { clone: res } } }))
            .catch((err) => dispatch({ type: "finish_clone", payload: { responses: { clone: err.response } } }));
    };

    const response = useMemo(
        () => state.responses.clone ?? state.responses.fetch ?? null,
        [state.responses.clone, state.responses.fetch],
    );

    const scrollUp = () => {
        const container = document.getElementById("repo-list");
        container?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleMore = () => {
        const page = ++state.search.page;
        dispatch({ type: "set_search", payload: { page } });
        getRepos({ q: state.search.q, page });
        scrollUp();
    };

    const handleLess = () => {
        let page: number;
        if (state.search.page > 1) {
            page = --state.search.page;
        } else {
            page = state.search.page;
        }
        dispatch({ type: "set_search", payload: { page } });
        getRepos({ q: state.search.q, page });
        scrollUp();
    };

    useEffect(() => {
        getRepos();
    }, [getRepos]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        // Function to change the response
        const changeResponse = () =>
            dispatch({ type: "set_state", payload: { responses: { fetch: undefined, clone: undefined } } });

        // Set up the interval to change the response every 5 seconds
        intervalId = setInterval(changeResponse, 5000);

        // Clean up the interval when the component unmounts or when text changes
        return () => {
            clearInterval(intervalId);
        };
    }, [state.responses.clone, state.responses.fetch]); // Effect will re-run if text changes

    const checkbox = useRef<any>();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    const bulkPush = () => {
        const serverRepos = selectedGHRepos.map((_) => makeServerRepo(_));

        axiosClient
            .post("select_repos", serverRepos, {
                headers: {
                    Authorization: `Token ${session?.key}`,
                },
            })
            .then((res) => {
                dispatch({ type: "finish_clone", payload: { responses: { clone: res } } });
                setSelectedGHRepos([]);
            })
            .catch((err) => dispatch({ type: "finish_clone", payload: { responses: { clone: err.response } } }));
    };

    const repoList = useMemo(
        () => (state.search.q === "" ? testRepos.slice(0, 10) : state.repos_search.items),
        [state.repos_search.items, state.search.q],
    );

    const hasContent = useMemo(() => {
        return repoList.length > 0;
    }, [repoList.length]);

    useLayoutEffect(() => {
        const isIndeterminate = selectedGHRepos.length > 0 && selectedGHRepos.length < repoList.length;
        setChecked(selectedGHRepos.length === repoList.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [repoList.length, selectedGHRepos]);

    const toggleAll = () => {
        setSelectedGHRepos(
            checked ? [] : indeterminate ? [...selectedGHRepos, ...repoList] : [...selectedGHRepos, ...repoList],
        );
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    };

    return (
        <Page>
            <Head>
                <title>Cloner | GHMRC</title>
            </Head>
            <motion.main className="isolate">
                <div className="py-24">
                    <div className="mx-autolg:max-w-7xl px-6 lg:px-8">
                        <div className="border-b border-gray-200 pb-5">
                            <div className="sm:flex sm:items-baseline sm:justify-between">
                                <div className="sm:w-0 sm:flex-1">
                                    <h1
                                        id="message-heading"
                                        className="flex items-center text-base space-x-2 font-semibold leading-6 text-gray-900">
                                        <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {cache.repositories.length}
                                        </span>
                                        <span>Repositories</span>
                                    </h1>
                                    <p className="mt-1 truncate text-sm text-gray-500">
                                        Search GitHub&apos;s API for target repositories.
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
                                    <div className="flex flex-1 items-center justify-center pr-2 lg:justify-end">
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
                                                    value={state.search.q}
                                                    onChange={onChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <TailwindMenu
                                        groups={[
                                            {
                                                name: "repos",
                                                actions: [
                                                    {
                                                        name: "My Repositories",
                                                        onClick: () => setOpen(true),
                                                    },
                                                ],
                                            },
                                            {
                                                name: "selection",
                                                actions: [
                                                    {
                                                        name: "View Selection",
                                                        onClick: () => setShowSelected(true),
                                                    },
                                                    {
                                                        name: "Select All",
                                                        onClick: () =>
                                                            setSelectedGHRepos((prev) => [...prev, ...repoList]),
                                                    },
                                                    {
                                                        name: "Empty Selection",
                                                        onClick: () => setSelectedGHRepos((_) => []),
                                                    },
                                                ],
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        <h1 className="sr-only">Repository Page</h1>
                        {/* Main 3 column grid */}

                        {/* Left column */}
                        <div className="relative">
                            {state.is_loading && (
                                <div className="absolute inset-0 text-center py-32 bg-gray-500 bg-opacity-25">
                                    <ScaleLoader color="#fff" />
                                </div>
                            )}

                            {hasContent ? (
                                <div className="flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <div className="relative">
                                                {selectedGHRepos.length > 0 && (
                                                    <div className="absolute left-14 w-full max-w-fit top-0 flex h-12 items-center space-x-3 bg-transparent sm:left-12">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedGHRepos([])}
                                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                                                            <XMarkIcon
                                                                className="h-5 w-5 mr-1"
                                                                aria-hidden="true"
                                                            />
                                                            Clear
                                                        </button>
                                                        <span className="block rounded bg-green-50 px-2 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                            {selectedGHRepos.length}{" "}
                                                            {pluralize("Repository", selectedGHRepos.length)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => bulkPush()}
                                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                                                            <RepoPushIcon
                                                                size={26}
                                                                className="h-4 w-4 mr-1"
                                                                aria-hidden="true"
                                                            />
                                                            Push
                                                        </button>
                                                    </div>
                                                )}
                                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="relative px-7 sm:w-12 sm:px-6">
                                                                <input
                                                                    disabled
                                                                    type="checkbox"
                                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                    ref={checkbox}
                                                                    checked={checked}
                                                                    onChange={toggleAll}
                                                                />
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                                Name
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-transparent">
                                                        {repoList.map((item) => {
                                                            item.is_selected = isRepoSelected(cache.repositories, item);
                                                            const isSelected = isGHRepoSelected(selectedGHRepos, item);

                                                            return (
                                                                <tr
                                                                    key={uniqueId(item.full_name)}
                                                                    className={isSelected ? "bg-blue-50" : undefined}>
                                                                    <td className="relative px-7 sm:w-12 sm:px-6">
                                                                        {isSelected && !item.is_selected && (
                                                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                                        )}
                                                                        {!isSelected && item.is_selected && (
                                                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-green-600" />
                                                                        )}
                                                                        {isSelected && item.is_selected && (
                                                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-orange-600" />
                                                                        )}

                                                                        <input
                                                                            type="checkbox"
                                                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                            checked={isSelected}
                                                                            onChange={(e) =>
                                                                                setSelectedGHRepos(
                                                                                    e.target.checked
                                                                                        ? [...selectedGHRepos, item]
                                                                                        : selectedGHRepos.filter(
                                                                                              (p) => p.id !== item.id,
                                                                                          ),
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        className={clsx(
                                                                            "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                                                                            isSelected
                                                                                ? "text-indigo-600"
                                                                                : "text-gray-900",
                                                                        )}>
                                                                        <div className="flex items-center">
                                                                            <div className="h-11 w-11 flex-shrink-0">
                                                                                <img
                                                                                    className="h-11 w-11 rounded-full"
                                                                                    src={item.owner.avatar_url}
                                                                                    alt={item.owner.login}
                                                                                />
                                                                            </div>
                                                                            <div className="ml-4 truncate">
                                                                                <div className="font-medium text-gray-900 truncate">
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className="mt-1 text-gray-500 truncate">
                                                                                    {item.owner.login}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                                        {item.is_selected ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeRepo(item)}
                                                                                className="text-rose-600 hover:text-rose-900">
                                                                                <RepoDeletedIcon
                                                                                    size={24}
                                                                                    className=""
                                                                                />
                                                                                <span className="sr-only">
                                                                                    , {item.name}
                                                                                </span>
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => selectRepo(item)}
                                                                                className="text-indigo-600 hover:text-indigo-900">
                                                                                <RepoPushIcon
                                                                                    size={24}
                                                                                    className=""
                                                                                />
                                                                                <span className="sr-only">
                                                                                    , {item.name}
                                                                                </span>
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    {state.search.q && (
                                        <div className="-mt-2">
                                            <div className="flex items-center justify-between py-5 border-y border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={handleLess}
                                                    className="inline-flex items-center text-gray-700 rounded-full p-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                                    <ChevronLeftIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Page {state.search.page}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handleMore}
                                                    className="inline-flex items-center text-gray-700 rounded-full p-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                                    <ChevronRightIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <RepoIcon
                                        size={16}
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <span className="mt-2 block text-sm font-semibold text-gray-900">
                                        Fill out the search form to get some repositories
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.main>
            <AlertNotification
                response={response}
                username={session?.profile?.login}
            />
            <SelectedRepos
                open={open}
                setOpen={setOpen}
            />
            <CurrentSelectedRepos
                open={showSelected}
                setOpen={setShowSelected}
            />
        </Page>
    );
}
