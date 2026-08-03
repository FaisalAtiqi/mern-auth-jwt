import { SignupMetadata } from "../../../../shared/types/metadata.js";

export interface BaseClientMetadata extends SignupMetadata {
  cpu?: string;
}
