/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as fixAdminRoles from "../fixAdminRoles.js";
import type * as incidents from "../incidents.js";
import type * as phishingSimulations from "../phishingSimulations.js";
import type * as profiles from "../profiles.js";
import type * as simulationResults from "../simulationResults.js";
import type * as trainingVideos from "../trainingVideos.js";
import type * as userManagement from "../userManagement.js";
import type * as userRoles from "../userRoles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  fixAdminRoles: typeof fixAdminRoles;
  incidents: typeof incidents;
  phishingSimulations: typeof phishingSimulations;
  profiles: typeof profiles;
  simulationResults: typeof simulationResults;
  trainingVideos: typeof trainingVideos;
  userManagement: typeof userManagement;
  userRoles: typeof userRoles;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
