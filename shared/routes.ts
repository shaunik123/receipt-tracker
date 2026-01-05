import { z } from 'zod';
import { insertUserSchema, insertReceiptSchema, insertNudgeSchema, receipts, nudges } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: insertUserSchema,
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.object({ id: z.number(), username: z.string() }).nullable(),
      },
    },
  },
  receipts: {
    upload: {
      method: 'POST' as const,
      path: '/api/receipts/upload',
      // input is FormData (multipart/form-data)
      responses: {
        201: z.custom<typeof receipts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/receipts',
      responses: {
        200: z.array(z.custom<typeof receipts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/receipts/:id',
      responses: {
        200: z.custom<typeof receipts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    analyze: { // Trigger re-analysis or manual correction
      method: 'POST' as const,
      path: '/api/receipts/:id/analyze',
      responses: {
        200: z.custom<typeof receipts.$inferSelect>(),
      },
    },
  },
  nudges: {
    list: {
      method: 'GET' as const,
      path: '/api/nudges',
      responses: {
        200: z.array(z.custom<typeof nudges.$inferSelect>()),
      },
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/nudges/:id/read',
      responses: {
        200: z.custom<typeof nudges.$inferSelect>(),
      },
    },
  },
  insights: {
    get: {
      method: 'GET' as const,
      path: '/api/insights',
      responses: {
        200: z.object({
          monthlyTotal: z.number(),
          categoryBreakdown: z.array(z.object({ category: z.string(), amount: z.number() })),
          insights: z.array(z.string()),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AuthRegisterInput = z.infer<typeof api.auth.register.input>;
export type Receipt = z.infer<typeof api.receipts.get.responses[200]>;
export type Nudge = z.infer<typeof api.nudges.list.responses[200]>[number];
