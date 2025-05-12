import type { Tool } from "../entities/Tool.js";
import { authSF } from "./AuthSF/AuthSF.js";
import { QueryRecords } from "./QueryRecords/QueryRecords.js";
import { RefreshObjectsContext } from "./RefreshObjectsContext/RefreshObjectsContext.js";
import { ListOrgs } from "./ListOrgs/ListOrgs.js";
import { GetOrgLimits } from "./GetOrgLimits/GetOrgLimits.js";
import { OpenOrgPage } from "./OpenOrgPage/OpenOrgPage.js";

export const tools: Tool[] = [
  authSF,
  ListOrgs,
  QueryRecords,
  RefreshObjectsContext,
  GetOrgLimits,
  OpenOrgPage,
];
