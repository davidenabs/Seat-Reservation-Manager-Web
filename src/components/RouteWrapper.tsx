import React from "react";

interface RouteWrapperProps {
    element: React.ReactNode;
    layout?: React.ComponentType<{ children: React.ReactNode }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layoutProps?: Record<string, any>;
}

const RouteWrapper = ({
    element,
    layout: Layout,
    layoutProps,
}: RouteWrapperProps) => {
    if (Layout) {
        return <Layout {...layoutProps}>{element}</Layout>;
    }
    return <>{element}</>; // If no layout is specified, render the element as-is
};

export default RouteWrapper;
