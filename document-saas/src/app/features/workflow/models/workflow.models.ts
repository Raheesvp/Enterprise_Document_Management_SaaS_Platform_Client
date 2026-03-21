export interface WorkflowInstance {
  id:                  string;
  tenantId:            string;
  documentId:          string;
  documentTitle:       string;
  status:              WorkflowStatus;
  currentStageOrder:   number;
  initiatedByUserId:   string;
  startedAt:           string;
  completedAt?:        string;
  stages:              WorkflowStage[];
}

export interface WorkflowStage {
  id:                string;
  stageOrder:        number;
  stageName:         string;
  assignedToUserId:  string;
  assignedToEmail:   string;
  status:            StageStatus;
  comments?:         string;
  slaDeadline:       string;
  processedAt?:      string;
}

export interface WorkflowDefinition {
  id:          string;
  tenantId:    string;
  name:        string;
  description: string;
  isActive:    boolean;
  createdAt:   string;
  stages:      WorkflowDefinitionStage[];
}

export interface WorkflowDefinitionStage {
  order:        number;
  stageName:    string;
  roleRequired: string;
  slaDays:      number;
}

export type WorkflowStatus =
  | "NotStarted"
  | "InProgress"
  | "Approved"
  | "Rejected"
  | "Escalated"
  | "Cancelled";

export type StageStatus =
  | "Pending"
  | "InProgress"
  | "Approved"
  | "Rejected"
  | "Escalated"
  | "Skipped";

export const WorkflowStatusColors: Record<WorkflowStatus, string> = {
  NotStarted: "#64748B",
  InProgress: "#EA580C",
  Approved:   "#16A34A",
  Rejected:   "#DC2626",
  Escalated:  "#7C3AED",
  Cancelled:  "#94A3B8",
};

export const StageStatusColors: Record<StageStatus, string> = {
  Pending:   "#94A3B8",
  InProgress:"#EA580C",
  Approved:  "#16A34A",
  Rejected:  "#DC2626",
  Escalated: "#7C3AED",
  Skipped:   "#64748B",
};
