// Tools available to AI agents. Each tool has a Gemini function declaration
// plus a handler that runs against Workaway's database.
import { contacts, transactions, tasks, dashboardSnapshot } from "../data";

export const TOOLS = {
  get_business_overview: {
    declaration: {
      name: "get_business_overview",
      description:
        "Get a high-level snapshot of the business: finances (income, expenses, profit, pending, overdue), contact counts and pipeline value, and open task count.",
      parameters: { type: "object", properties: {} },
    },
    handler: () => dashboardSnapshot(),
  },

  list_contacts: {
    declaration: {
      name: "list_contacts",
      description: "List CRM contacts, optionally filtered by status.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", description: "Filter: lead, active, or churned. Omit for all." },
        },
      },
    },
    handler: ({ status } = {}) => {
      const all = contacts.list();
      const rows = status ? all.filter((c) => c.status === status) : all;
      return rows.map(({ id, name, company, status, value, email }) => ({ id, name, company, status, value, email }));
    },
  },

  create_contact: {
    declaration: {
      name: "create_contact",
      description: "Add a new contact / lead to the CRM.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          company: { type: "string" },
          status: { type: "string", description: "lead, active, or churned" },
          value: { type: "number", description: "Estimated deal value in dollars" },
          notes: { type: "string" },
        },
        required: ["name"],
      },
    },
    handler: (args) => {
      const info = contacts.create(args);
      return { created: true, id: info.lastInsertRowid };
    },
  },

  list_transactions: {
    declaration: {
      name: "list_transactions",
      description: "List recent financial transactions (income and expenses).",
      parameters: { type: "object", properties: {} },
    },
    handler: () => transactions.list().slice(0, 50),
  },

  finance_summary: {
    declaration: {
      name: "finance_summary",
      description: "Get totals for income, expenses, profit, pending and overdue amounts.",
      parameters: { type: "object", properties: {} },
    },
    handler: () => transactions.summary(),
  },

  create_task: {
    declaration: {
      name: "create_task",
      description: "Create a to-do task for the team.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          priority: { type: "string", description: "low, medium, or high" },
          due_at: { type: "string", description: "Due date YYYY-MM-DD" },
        },
        required: ["title"],
      },
    },
    handler: (args) => {
      const info = tasks.create(args);
      return { created: true, id: info.lastInsertRowid };
    },
  },

  list_tasks: {
    declaration: {
      name: "list_tasks",
      description: "List current tasks and their status.",
      parameters: { type: "object", properties: {} },
    },
    handler: () => tasks.list(),
  },
};

export function declarationsFor(names) {
  return names.map((n) => TOOLS[n].declaration);
}

export async function runTool(name, args) {
  const tool = TOOLS[name];
  if (!tool) return { error: `Unknown tool: ${name}` };
  try {
    return tool.handler(args || {});
  } catch (err) {
    return { error: String(err.message || err) };
  }
}
