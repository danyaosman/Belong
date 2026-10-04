import { UserVocabulary } from "../types/vocabulary";
import { apiRequest } from "../types/api";

export async function getMyVocabulary(
  token: string,
): Promise<UserVocabulary[]> {
  return apiRequest<UserVocabulary[]>(
    "/vocabulary/me",
    {
      method: "GET",
    },
    token,
  );
}