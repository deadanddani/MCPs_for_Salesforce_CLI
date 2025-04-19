import type { Tool } from "../entities/Tool.js";
import { authSF } from "./AuthSF/AuthSF.js";
import { GenericCommand } from "./GenericCommand/GenericCommand.js";
import { QueryRecords } from "./QueryRecords/QueryRecords.js";
import { RefreshObjectsContext } from "./RefreshObjectsContext/RefreshObjectsContext.js";
import { ListOrgs } from "./ListOrgs/ListOrgs.js";

export const tools: Tool[] = [
  authSF,
  ListOrgs,
  QueryRecords,
  RefreshObjectsContext,
  GenericCommand,
];
