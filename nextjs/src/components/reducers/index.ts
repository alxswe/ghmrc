import { IGithubRepository } from "@/types/repository";
import { AxiosResponse } from "axios";

type searchRepoPage = {
    is_loading: boolean;
    search: {
        page: number;
        per_page: number;
        q: string;
        order: string;
        sort: string;
    };
    repos_search: {
        total_count: number;
        incomplete_results: boolean;
        items: IGithubRepository[];
    };
    repos_list: IGithubRepository[];
    responses: {
        fetch?: AxiosResponse;
        clone?: AxiosResponse;
    };
};

export const initialSearchRepoPageState: searchRepoPage = {
    is_loading: false,
    search: {
        q: "",
        page: 1,
        per_page: 30,
        order: "desc",
        sort: "stars",
    },
    repos_search: {
        total_count: 0,
        incomplete_results: false,
        items: [],
    },
    repos_list: [],
    responses: {
        fetch: undefined,
        clone: undefined,
    },
};

type actionTypes =
    | "set_state"
    | "set_search"
    | "start_repos_search"
    | "finish_repos_search"
    | "start_repos_list"
    | "finish_repos_list"
    | "start_fetch"
    | "finish_fetch"
    | "set_fetch_reposnse"
    | "set_clone_reposnse"
    | "start_clone"
    | "finish_clone";

type actionPayload = {
    type: actionTypes;
    payload?: any;
};

export function searchRepoPageReducer(state: searchRepoPage, action: actionPayload): searchRepoPage {
    switch (action.type) {
        case "set_state":
            return { ...state, ...action.payload };
        case "set_search":
            return { ...state, search: { ...state.search, ...action.payload } };
        case "start_fetch":
            return { ...state, is_loading: true };
        case "finish_fetch":
            return { ...state, is_loading: false, ...action.payload };
        case "start_clone":
            return { ...state, is_loading: true };
        case "finish_clone":
            return { ...state, is_loading: false, ...action.payload };
        case "finish_repos_search":
            return {
                ...state,
                is_loading: false,
                repos_search: action.payload,
                responses: { fetch: undefined, clone: undefined },
            };
        case "finish_repos_list":
            return {
                ...state,
                is_loading: false,
                repos_list: action.payload,
                responses: { fetch: undefined, clone: undefined },
            };
        default:
            return state;
    }
}
