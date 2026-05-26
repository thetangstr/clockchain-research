/**
 * Build-time data validation script.
 * Run with: npx tsx src/lib/validate-data.ts
 * Integrated into: npm run validate
 */

import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const briefSectionSchema = z.object({
  key: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  glossary: z.record(z.string(), z.string()).optional(),
});

const briefSourceSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
});

export const briefSchema = z.object({
  slug: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9-]+$/),
  title: z.string().min(10).max(110),
  dek: z.string().min(10).max(280),
  date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
  dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  readTimeMinutes: z.number().int().min(1).max(30),
  topic: z.string().optional(),
  tldr: z.string().min(600),
  briefAlso: z.boolean().optional(),
  sections: z.array(briefSectionSchema).min(3).max(8),
  keyPoints: z.array(z.string().min(20).max(280)).min(3).max(7).optional(),
  nextUp: z.array(z.string().min(15).max(200)).length(3),
  sources: z.array(briefSourceSchema).min(4).max(15),
});

export type BriefData = z.infer<typeof briefSchema>;

const DATA_DIR = path.join(process.cwd(), "src", "data");

let errors = 0;
let validated = 0;

function validateFiles(dir: string, schema: typeof briefSchema, label: string) {
  const fullDir = path.join(DATA_DIR, dir);
  if (!fs.existsSync(fullDir)) {
    console.log(`  [SKIP] ${fullDir} does not exist yet`);
    return;
  }

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log(`  [SKIP] No JSON files in ${dir}/`);
    return;
  }

  for (const file of files) {
    const filePath = path.join(fullDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const result = schema.safeParse(data);
      if (result.success) {
        console.log(`  [OK] ${dir}/${file}`);
        validated++;
      } else {
        console.error(`  [FAIL] ${dir}/${file}:`);
        for (const issue of result.error.issues) {
          console.error(`    - ${issue.path.join(".")}: ${issue.message}`);
        }
        errors++;
      }
    } catch (e) {
      console.error(`  [ERROR] ${dir}/${file}: ${e instanceof Error ? e.message : "Unknown error"}`);
      errors++;
    }
    // label is reserved for future use (e.g. structured reporting); referenced to silence noUnusedParameters
    void label;
  }
}

console.log("\n=== Data Validation ===\n");

console.log("Briefs:");
validateFiles("briefs", briefSchema, "brief");

console.log(`\n=== Results: ${validated} passed, ${errors} failed ===\n`);

if (errors > 0) {
  process.exit(1);
}
