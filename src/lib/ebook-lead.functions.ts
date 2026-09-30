import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ebookLeadSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]+$/, "Telefone inválido")
    .min(10, "Telefone incompleto")
    .max(20, "Telefone inválido"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
});

export const saveEbookLead = createServerFn({ method: "POST" })
  .inputValidator((data) => ebookLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const { insertEbookLead } = await import("./ebook-lead.server");
    return insertEbookLead(data);
  });
