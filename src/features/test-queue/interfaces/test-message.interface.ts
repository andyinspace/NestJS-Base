export interface TestMessageJob {
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
