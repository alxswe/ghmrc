import { Repository } from "@/components/cache/db";
import { IGithubRepository } from "@/types/repository";

export const makeServerRepo = (repo: IGithubRepository) => ({
    name: repo.name,
    owner: repo.owner.login,
    avatar_url: repo.owner.avatar_url,
});

export const isRepoSelected = (list: Repository[], repo: IGithubRepository) =>
    list.findIndex((selected) => selected.name === repo.name && selected.owner === repo.owner.login) !== -1;

export const isGHRepoSelected = (list: IGithubRepository[], repo: IGithubRepository) =>
    list.findIndex((selected) => selected.id === repo.id) !== -1;
