export type ActivityLogContext = {
  userId?: number | null;
  userName?: string | null;
  ipAddress?: string | null;
};

export type ActivityLogInput = {
  action: string;
  module: string;
  description: string;
} & ActivityLogContext;
