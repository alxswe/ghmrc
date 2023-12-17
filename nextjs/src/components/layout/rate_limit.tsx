import { ghClient } from "@/components/client";
import AlertResponse from "@/components/layout/alert_response";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

export default function RateLimit() {
    const { data: session } = useSession();
    const [updateLimit, setUpdateLimit] = useSessionStorage("update_limit", false);
    const [rateLimit, setRateLimit] = useState({
        resources: {
            core: { limit: 0, remaining: 0, reset: 0, used: 0, resource: "core" },
            search: { limit: 0, remaining: 0, reset: 0, used: 0, resource: "search" },
        },
    });
    const [response, setResponse] = useState<AxiosResponse | null>(null);

    const getRateLimit = useCallback(() => {
        ghClient
            .get<typeof rateLimit>("rate_limit", undefined, {
                headers: {
                    Authorization: `Bearer ${session?.account?.access_token}`,
                },
            })
            .then((res) => setRateLimit(res.data))
            .catch((err) => setResponse(err.response));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLimit]);

    useEffect(() => {
        getRateLimit();
        setUpdateLimit(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getRateLimit]);

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
        <section
            aria-labelledby="rate-limit"
            className="overflow-hidden rounded-lg shadow">
            <h2
                className="px-4 py-3 text-center text-white bg-gray-700"
                id="section-1-title">
                Rate Limit
            </h2>
            <div>
                <AlertResponse response={response} />
                <div className="divide-y divide-gray-200 bg-white">
                    <div className="px-4 py-3">
                        <h5 className="text-gray-900 font-semibold text-base leading-6 flex-1">Core</h5>
                        <div className="mt-2 space-y-1">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <p className="text-gray-500 font-medium">Requests</p>
                                <p className="text-gray-700 font-semibold text-sm rounded-lg mt-1 sm:mt-0">
                                    {rateLimit.resources?.core?.used}/{rateLimit.resources?.core?.limit}
                                </p>
                            </div>
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <p className="text-gray-500 font-medium">Resets</p>
                                <p className="text-gray-700 font-semibold text-sm  rounded-lg mt-1 sm:mt-0">
                                    {moment(rateLimit.resources?.core?.reset * 1000).format("hh:mm A")}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <h5 className="text-gray-900 font-semibold text-base leading-6 flex-1">Search</h5>
                        <div className="mt-2 space-y-1">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <p className="text-gray-500 font-medium">Requests</p>
                                <p className="text-gray-700 font-semibold text-sm  rounded-lg mt-1 sm:mt-0">
                                    {rateLimit.resources?.search?.used}/{rateLimit.resources?.search?.limit}
                                </p>
                            </div>
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <p className="text-gray-500 font-medium">Resets</p>
                                <p className="text-gray-700 font-semibold text-sm  rounded-lg mt-1 sm:mt-0">
                                    {moment(rateLimit.resources?.search?.reset * 1000).format("hh:mm A")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
