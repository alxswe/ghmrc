import CacheContainer from "@/components/cache/provider";
import ErrorBoundary from "@/components/layout/boundary";
import NotificationCenter from "@/components/layout/notification/center";
import AlertMessageNotification from "@/components/layout/notification/message";
import { getServerAuthSession } from "@/server/auth";
import "@/styles/globals.css";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export const getServerSideProps = async (context: { req: NextApiRequest; res: NextApiResponse }) => {
    const session = await getServerAuthSession(context);
    return { props: { session } };
};

function SafeHydrate(props: any) {
    const [client, setClient] = useState(false);

    useEffect(() => {
        setClient(typeof window !== "undefined");
    }, []);

    if (client) {
        return props.children;
    }

    return <div suppressHydrationWarning />;
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <SafeHydrate>
                <CacheContainer>
                    <AlertMessageNotification />
                    <NotificationCenter />
                    <ErrorBoundary>
                        <Component {...pageProps} />
                    </ErrorBoundary>
                </CacheContainer>
            </SafeHydrate>
        </SessionProvider>
    );
}
