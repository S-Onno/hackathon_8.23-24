import type { WordCard } from '@/types/card';

function isWordCard(value: unknown): value is WordCard {
  if (typeof value !== 'object' || value === null) return false;

  const card = value as Record<string, unknown>;
  return (
    typeof card.id === 'number' &&
    typeof card.question === 'string' &&
    typeof card.answer === 'string' &&
    typeof card.createdAt === 'string' &&
    typeof card.updatedAt === 'string'
  );
}

export async function fetchWordCards(signal?: AbortSignal): Promise<WordCard[]> {
  const response = await fetch('/api/cards', { signal });
  if (!response.ok) {
    throw new Error(`カードの取得に失敗しました (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isWordCard)) {
    throw new Error('カードAPIから不正なデータが返されました');
  }

  return payload;
}

export async function readWordCardResponse(response: Response): Promise<WordCard> {
  if (!response.ok) {
    throw new Error(`カードの保存に失敗しました (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!isWordCard(payload)) {
    throw new Error('カードAPIから不正なデータが返されました');
  }

  return payload;
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}
