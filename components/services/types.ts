import type { Service } from "@/lib/services";

export type ServiceItem = Service & {
  /** Resolved on the server: whether the PNG exists under /public. */
  hasImage: boolean;
};
