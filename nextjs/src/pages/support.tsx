import { axiosClient } from "@/components/client";
import AlertResponse from "@/components/layout/alert_response";
import Page from "@/components/layout/motion/page";
import { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";

export default function SupportPage() {
    const { data: session } = useSession();
    const [response, setResponse] = useState<AxiosResponse | null>(null);
    const [data, setData] = useState({
        title: "",
        content: "",
    });

    const onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { currentTarget } = e,
            { name, value } = currentTarget;
        setData((_) => ({ ..._, [name]: value }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axiosClient
            .post<any>("support", data, { headers: { Authorization: `Token ${session?.key}` } })
            .then((res) => {
                setResponse(res);
                setData({
                    title: "",
                    content: "",
                });
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

    return (
        <Page>
            <Head>
                <title>Support | GHMRC</title>
            </Head>
            <motion.main className="isolate">
                <div className="py-24 md:py-32  px-6 lg:px-8">
                    <motion.div
                        initial={{ y: "-20%" }}
                        animate={{ y: "0%" }}
                        className="mx-auto max-w-xl lg:max-w-4xl">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900">Contact Support</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            If you experience any issue with our app, don&apos;t hesiste to contact us
                        </p>
                        <div className="mt-16 space-y-4 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
                            <motion.form
                                initial={{ x: "-20%" }}
                                animate={{ x: "calc(0%)" }}
                                onSubmit={onSubmit}
                                className="lg:flex-auto space-y-4">
                                <AlertResponse response={response} />
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-semibold leading-6 text-gray-900">
                                            Title
                                        </label>
                                        <div className="mt-2.5">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                onChange={onChange}
                                                value={data.title}
                                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="content"
                                            className="block text-sm font-semibold leading-6 text-gray-900">
                                            Message
                                        </label>
                                        <div className="mt-2.5">
                                            <textarea
                                                id="content"
                                                name="content"
                                                rows={4}
                                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={data.content}
                                                onChange={onChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Let’s talk
                                    </button>
                                </div>
                            </motion.form>
                            <motion.div
                                initial={{ x: "20%" }}
                                animate={{ x: "calc(0%)" }}
                                className="lg:mt-6 lg:w-80 lg:flex-none">
                                <img
                                    className="h-12 w-auto"
                                    src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg"
                                    alt=""
                                />
                                <figure className="mt-10">
                                    <blockquote className="text-lg font-semibold leading-8 text-gray-900">
                                        <p>“The way to succeed is to double your failure rate.”</p>
                                        <p className="text-right italic text-sm">- Thomas J. Watson</p>
                                    </blockquote>
                                </figure>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </Page>
    );
}
