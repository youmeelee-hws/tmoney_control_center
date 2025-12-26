import { post } from "./http";

export type PlayTicketResponse = {
  stream_id: string;
  token: string;
  expires_at: string;
};

export function issuePlayTicket(streamId: string) {
  return post<PlayTicketResponse>(`/v1/streams/${streamId}/play-ticket`);
}