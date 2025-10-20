import type { Tool } from "../entities/Tool.js";
import { authSF } from "./AuthSF/AuthSF.js";
import { QueryRecords } from "./QueryRecords/QueryRecords.js";
import { GetObjectsContext } from "./GetObjectsContext/GetObjectsContext.js";
import { GetObjectSchema } from "./GetObjectSchema/GetObjectSchema.js";
import { ListOrgs } from "./ListOrgs/ListOrgs.js";
import { GetOrgLimits } from "./GetOrgLimits/GetOrgLimits.js";
import { OpenOrgPage } from "./OpenOrgPage/OpenOrgPage.js";
import { DeployMetadata } from "./DeployMetadata/DeployMetadata.js";
import { RunTests } from "./RunTests/RunTests.js";

export const tools: Tool[] = [
  authSF,
  ListOrgs,
  QueryRecords,
  GetObjectsContext,
  GetObjectSchema,
  GetOrgLimits,
  OpenOrgPage,
  DeployMetadata,
  RunTests
];
