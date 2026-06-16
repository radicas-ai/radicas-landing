import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_LEADS_DB_ID;

/** True when both the integration token and the target database are configured. */
export const notionConfigured = Boolean(token && databaseId);

const notion = token ? new Client({ auth: token }) : null;

export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Append a lead to the "Radicas — Leads" database. Properties match the schema created via the
 * Notion MCP: Name (title), First name, Last name (rich_text), Email (email), Source/Status (select).
 */
export async function createLead({ firstName, lastName, email }: Lead): Promise<void> {
  if (!notion || !databaseId) {
    throw new Error("Notion is not configured (NOTION_TOKEN / NOTION_LEADS_DB_ID).");
  }

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: `${firstName} ${lastName}`.trim() } }] },
      "First name": { rich_text: [{ text: { content: firstName } }] },
      "Last name": { rich_text: [{ text: { content: lastName } }] },
      Email: { email },
      Source: { select: { name: "Landing" } },
      Status: { select: { name: "New" } },
    },
  });
}
