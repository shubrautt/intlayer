import { listenChangeSSE } from '@controllers/event-listener';
import { Router } from 'express';
import { Routes } from '@/types/Routes';

export const eventListenerRouter: Router = Router();

const baseURL = `${process.env.BACKEND_URL}/api/event-listener`;

export const eventListenerRoutes = {
  checkDictionaryChangeSSE: {
    urlModel: '/event-listener/:accessToken',
    url: ({ accessToken }: { accessToken: string }) =>
      `${baseURL}/event-listener/${accessToken}`,
    method: 'GET',
  },
} satisfies Routes;

eventListenerRouter.get(
  eventListenerRoutes.checkDictionaryChangeSSE.urlModel,
  listenChangeSSE
);
