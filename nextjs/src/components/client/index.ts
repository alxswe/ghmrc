import { AxiosRequestConfig } from "axios";
import { AxiosClient } from "axios-clt";

const axiosAliasconfig: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
};

const axiosAliases = {
    cache: "/router/cache/",
    repos: "/router/repositories/",
    clone_repos: "/router/repositories/clone/",
    clear_repos: "/router/repositories/remove/",
    download_repos: "/router/repositories/download/",
    download_repo: "/router/repositories/:id/download/",
    select_repos: "/router/repositories/bulk/",
    repo: "/router/repositories/:id/",
    remove_repo: "/router/repositories/:id/remove/",
    clone_repo: "/router/repositories/:id/clone/",
    support: "/router/support/",
};

export const axiosClient = new AxiosClient({
    config: axiosAliasconfig,
    aliases: axiosAliases,
});

const ghConfig: AxiosRequestConfig = {
    baseURL: "https://api.github.com",
};
const ghAliases = {
    repos_search: "/search/repositories",
    rate_limit: "/rate_limit",
    repos: "/repositories",
    repo: "/repos/:owner/:repo",
    users: "/users",
    user: "/users/:user",
};

export const ghClient = new AxiosClient({
    config: ghConfig,
    aliases: ghAliases,
});

const nextAuthConfig: AxiosRequestConfig = {
    baseURL: process.env.SERVER_URL,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
};

const nextAuthAliases = {
    gh_login: "/router/auth/login/github/",
};

export const authClient = new AxiosClient({
    config: nextAuthConfig,
    aliases: nextAuthAliases,
});
