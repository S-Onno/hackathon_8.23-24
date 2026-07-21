'use client';

import Image from 'next/image';
import { type FormEvent, useEffect, useState } from 'react';

const DEFAULT_PROFILE = {
  goal: '成果物の完成を目指しています',
  favoriteSubject: 'Web開発',
  recentEffort: '単語帳の作成を頑張っています！',
};

type Account = {
  id: number;
  email: string;
  username: string;
};

type Profile = typeof DEFAULT_PROFILE;
type LoadState = 'loading' | 'ready' | 'error';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAccount(value: unknown): value is Account {
  if (!isRecord(value)) return false;

  return (
    Number.isInteger(value.id) &&
    typeof value.email === 'string' &&
    typeof value.username === 'string'
  );
}

function isMeResponse(value: unknown): value is { account: Account } {
  return isRecord(value) && isAccount(value.account);
}

function isProfile(value: unknown): value is Profile {
  if (!isRecord(value)) return false;

  return (
    typeof value.goal === 'string' &&
    typeof value.favoriteSubject === 'string' &&
    typeof value.recentEffort === 'string'
  );
}

function profileStorageKey(accountId: number) {
  return `profile:${accountId}`;
}

function readStoredProfile(accountId: number): Profile {
  const storageKey = profileStorageKey(accountId);
  const storedProfile = localStorage.getItem(storageKey);
  if (!storedProfile) return DEFAULT_PROFILE;

  try {
    const parsedProfile: unknown = JSON.parse(storedProfile);
    if (isProfile(parsedProfile)) return parsedProfile;
  } catch (error) {
    console.warn('保存済みプロフィールを読み込めませんでした:', error);
  }

  localStorage.removeItem(storageKey);
  return DEFAULT_PROFILE;
}

export default function ProfileCard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`プロフィール取得に失敗しました (${response.status})`);
        }

        const body: unknown = await response.json();
        if (!isMeResponse(body)) {
          throw new Error('プロフィール取得結果の形式が不正です');
        }

        if (controller.signal.aborted) return;

        setAccount(body.account);
        setProfile(readStoredProfile(body.account.id));
        setLoadState('ready');
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('プロフィールを取得できませんでした:', error);
        setLoadState('error');
      }
    }

    void loadAccount();
    return () => controller.abort();
  }, [requestVersion]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) return;

    localStorage.setItem(profileStorageKey(account.id), JSON.stringify(profile));
    setIsEditing(false);
  };

  const retry = () => {
    setLoadState('loading');
    setRequestVersion((version) => version + 1);
  };

  if (loadState === 'loading') {
    return (
      <section className="bg-white text-gray-800 rounded-lg shadow-md p-6 w-full max-w-md h-full">
        <h2 className="text-xl font-bold mb-4">プロフィール</h2>
        <p role="status">読み込み中...</p>
      </section>
    );
  }

  if (loadState === 'error' || !account) {
    return (
      <section className="bg-white text-gray-800 rounded-lg shadow-md p-6 w-full max-w-md h-full">
        <h2 className="text-xl font-bold mb-4">プロフィール</h2>
        <p role="alert" className="text-red-700">
          プロフィールを読み込めませんでした。
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          再試行
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white text-gray-800 rounded-lg shadow-md p-6 w-full max-w-md h-full flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-4">プロフィール</h2>

      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <Image
            src="/_images/earth.png"
            alt="地球"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full shadow-md"
          />
        </div>

        <div className="flex flex-col text-sm space-y-2 flex-1">
          <p>
            <span className="font-semibold">名前：</span>
            {account.username}
          </p>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              <label className="block">
                <span className="font-semibold">目標</span>
                <input
                  type="text"
                  value={profile.goal}
                  onChange={(event) =>
                    setProfile({ ...profile, goal: event.target.value })
                  }
                  className="border p-1 rounded w-full"
                />
              </label>
              <label className="block">
                <span className="font-semibold">好きな科目</span>
                <input
                  type="text"
                  value={profile.favoriteSubject}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      favoriteSubject: event.target.value,
                    })
                  }
                  className="border p-1 rounded w-full"
                />
              </label>
              <label className="block">
                <span className="font-semibold">最近の取り組み</span>
                <input
                  type="text"
                  maxLength={300}
                  value={profile.recentEffort}
                  onChange={(event) =>
                    setProfile({ ...profile, recentEffort: event.target.value })
                  }
                  className="border p-1 rounded w-full"
                />
              </label>
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                保存する
              </button>
            </form>
          ) : (
            <>
              <p>
                <span className="font-semibold">目標：</span>
                {profile.goal}
              </p>
              <p>
                <span className="font-semibold">好きな科目：</span>
                {profile.favoriteSubject}
              </p>
              <p>
                <span className="font-semibold">最近の取り組み：</span>
                {profile.recentEffort}
              </p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-2 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                編集する
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
