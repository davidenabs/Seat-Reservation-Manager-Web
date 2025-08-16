import { ROUTES } from "@/config/route";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CustomRouteObject {
  path: AppRoutes;
  element: React.ReactNode;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  layoutProps?: Record<string, any>;
}

type ValueOf<T> = T[keyof T];
export type FlattenRoutes<T> = T extends string
  ? T
  : T extends object
  ? FlattenRoutes<ValueOf<T>>
  : never;

export type AppRoutes = FlattenRoutes<typeof ROUTES>;
