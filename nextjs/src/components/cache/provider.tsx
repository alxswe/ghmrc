/* eslint-disable react-hooks/exhaustive-deps */
import * as cache from "@/components/cache/db";
import { axiosClient } from "@/components/client";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import getConfig from "next/config";
import { createContext, useCallback, useEffect, useMemo } from "react";
import { useSessionStorage } from "usehooks-ts";
import { ConstantBackoff, Websocket, WebsocketBuilder } from "websocket-ts";

const { publicRuntimeConfig: config } = getConfig();

interface CacheContextInterface {
    repositories: cache.Repository[];
    messages: cache.Message[];
}

export const missingObj = {
    id: 0,
    value: 0,
    label: "Missing instance",
};

const cachecontext: CacheContextInterface = {
    repositories: [],
    messages: [],
};

export const CacheContext = createContext(cachecontext);

export default function CacheContainer(props: any) {
    const { data: session } = useSession();
    const [_, setMessage] = useSessionStorage("message", null);

    async function onMessage(i: Websocket, e: MessageEvent<any>) {
        const message = JSON.parse(e.data);
        const table = cache.cachedb.getTable(message.table);
        if (message.action !== "delete") {
            await table.put(message.data, message.data.value || message.data.pk || message.data.id);
        } else {
            try {
                await table.delete(message.data.value || message.data.pk || message.data.id);
            } catch (error) {
                console.log({ error });
            }
        }
    }

    function onClose(i: Websocket, e: CloseEvent) {
        console.log("Retry reconnection after 1000ms...");
    }

    function onOpen(i: Websocket, e: Event) {
        console.log("Connection successful with: " + i.underlyingWebsocket?.url);
    }

    useEffect(() => {
        if (!session?.key) {
            return;
        }

        const cacheSocket = new WebsocketBuilder(`${config.NEXT_PUBLIC_SOCKET_URL}/cache/`)
            .withBackoff(new ConstantBackoff(1000))
            .onMessage((i, e) => onMessage(i, e))
            .onClose((i, e) => onClose(i, e))
            .onOpen((i, e) => onOpen(i, e))
            .onError((i, e) => {})
            .build();

        const msgSocket = new WebsocketBuilder(`${config.NEXT_PUBLIC_SOCKET_URL}/repositories/`)
            .withBackoff(new ConstantBackoff(1000))
            .onMessage((i, e) => onMessage(i, e))
            .onClose((i, e) => onClose(i, e))
            .onOpen((i, e) => onOpen(i, e))
            .onError((i, e) => {})
            .build();

        const rpSocket = new WebsocketBuilder(`${config.NEXT_PUBLIC_SOCKET_URL}/messages/`)
            .withBackoff(new ConstantBackoff(1000))
            .onMessage((i, e) => {
                onMessage(i, e);
                setMessage(JSON.parse(e.data).data);
            })
            .onClose((i, e) => onClose(i, e))
            .onOpen((i, e) => onOpen(i, e))
            .onError((i, e) => {})
            .build();

        return () => {
            cacheSocket.close();
            msgSocket.close();
            rpSocket.close();
        };
    }, [session?.key]);

    const loadChoices = useCallback(() => {
        if (!session?.key) return;

        const controller = new AbortController();
        axiosClient
            .get<any>("cache", undefined, {
                signal: controller.signal,
                headers: { Authorization: `Token ${session?.key}` },
            })
            .then((res) => {
                const { data } = res;
                Object.keys(data).forEach((_table) => {
                    try {
                        const table = cache.cachedb.getTable(_table);
                        table.clear().catch((err) => console.error("Unable to clear table: ", table.name));
                        table
                            .bulkPut(data[_table])
                            .catch((err) => console.error("Unable to update table: ", table.name));
                    } catch (error) {
                        console.error("Error on save: ", { error });
                    }
                });
            })
            .catch((err) => console.error("Error on cache fetch."));

        return () => {
            controller.abort();
        };
    }, [session?.key]);

    useEffect(() => {
        loadChoices();
    }, [loadChoices]);

    const repositories = useLiveQuery(() => cache.cachedb.repositories.toArray()) ?? [];
    const messages = useLiveQuery(() => cache.cachedb.messages.toArray()) ?? [];

    const providerValue = useMemo(
        () => ({
            repositories,
            messages,
        }),
        [repositories, messages],
    );

    return <CacheContext.Provider value={providerValue}>{props.children}</CacheContext.Provider>;
}
