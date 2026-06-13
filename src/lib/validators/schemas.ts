import { z } from 'zod'

// --- Quest Schemas ---
export const questSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter"),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional().nullable(),
  urgency: z.enum(['Routine', 'Priority', 'Emergency', 'Strategic']).optional(),
  difficulty: z.enum(['F', 'E', 'D', 'C', 'B', 'A', 'S']).optional().nullable(),
  deadline: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  successParameter: z.string().optional().nullable(),
  briefAttachmentUrl: z.string().url().optional().nullable(),
  detailCompleted: z.boolean().optional(),
  projectId: z.string().optional().nullable(),
  
  // GM Only fields (validated conditionally or allowed as optional)
  assignedTo: z.string().optional().nullable(),
  rewardPoints: z.union([z.string(), z.number()]).transform(val => Number(val)).optional().nullable(),
  status: z.enum([
    'Draft', 'ActiveStar', 'Active', 'Hold', 'Submitted', 
    'Approved', 'Rejected', 'Revise', 'Failed', 'Completed', 
    'Cancelled', 'Aborted'
  ]).optional(),
})

export const questUpdateSchema = questSchema.partial()

// --- Project Schemas ---
export const projectSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  health: z.enum(['Sehat', 'Sakit', 'Krisis']).optional(),
  targetKpi: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  arcId: z.string().optional().nullable(),
})

export const projectUpdateSchema = projectSchema.partial()

// --- Vault Schemas ---
export const vaultItemSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong").max(200),
  type: z.string().min(1, "Tipe tidak boleh kosong").max(50),
  summary: z.string().max(1000).optional().nullable(),
  fileUrl: z.string().url("URL file tidak valid"),
  visibility: z.string().default('all'),
  arcId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
})
