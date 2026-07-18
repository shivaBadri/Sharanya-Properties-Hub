import { pool, hasDatabase } from "@/lib/db";
import { faqs as staticFaqs } from "@/data/content";

export interface Faq {
  question: string;
  answer: string;
}

export async function getFaqs(): Promise<Faq[]> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(`SELECT question, answer FROM faqs ORDER BY sort_order ASC`);
    return rows.map((r) => ({ question: String(r.question), answer: String(r.answer) }));
  }
  return staticFaqs;
}
