import Dexie, { Table } from "dexie";

export interface Repository {
    pk: number;
    is_cloned: boolean;
    name: string;
    owner: string;
    avatar_url: string;
    file: string;
    added_on: string;
    modified_on: string;
}

export interface Message {
    pk: number;
    title: string;
    content: string;
    type: string;
    added_on: string;
    modified_on: string;
}

export class CacheDexieDb extends Dexie {
    // make sure you table name match the pluralized version of their django model name

    messages!: Table<Message>;
    repositories!: Table<Repository>;

    constructor() {
        super("ghmrc");
        this.version(5).stores({
            messages: "++id,pk,title,content,type,added_on,modified_on",
            repositories: "++id,pk,is_cloned,owner,avatar_url,file,added_on,modified_on",
        });
    }

    getTable(tablename: string) {
        const t = this.tables.find((t) => t.name === tablename);
        if (t) {
            return t;
        }

        throw new Error(`Table ${tablename} does not exist.`);
    }
}

export const cachedb = new CacheDexieDb();
