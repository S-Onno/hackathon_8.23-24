type ValidationSuccess<T> = { success: true; data: T };
type ValidationFailure = {
  success: false;
  errors: Record<string, string[]>;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export type SignupInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CardInput = {
  question: string;
  answer: string;
};

export type StudyLogInput = {
  clientSessionId: string;
  subject: string;
  durationSeconds: number;
  startedAt: Date;
  endedAt: Date;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function addError(
  errors: Record<string, string[]>,
  field: string,
  message: string,
) {
  (errors[field] ??= []).push(message);
}

function trimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateSignupInput(
  body: Record<string, unknown>,
): ValidationResult<SignupInput> {
  const errors: Record<string, string[]> = {};
  const email = trimmedString(body.email).toLowerCase();
  const username = trimmedString(body.username);
  const password = typeof body.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    addError(errors, "email", "有効なメールアドレスを入力してください。");
  }
  if (username.length < 2 || username.length > 50) {
    addError(errors, "username", "ユーザー名は2〜50文字で入力してください。");
  }
  if (password.length < 8 || password.length > 128) {
    addError(errors, "password", "パスワードは8〜128文字で入力してください。");
  }

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { email, username, password } };
}

export function validateLoginInput(
  body: Record<string, unknown>,
): ValidationResult<LoginInput> {
  const errors: Record<string, string[]> = {};
  const email = trimmedString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    addError(errors, "email", "有効なメールアドレスを入力してください。");
  }
  if (password.length < 1 || password.length > 128) {
    addError(errors, "password", "パスワードを入力してください。");
  }

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { email, password } };
}

export function validateCardInput(
  body: Record<string, unknown>,
): ValidationResult<CardInput> {
  const errors: Record<string, string[]> = {};
  const question = trimmedString(body.question);
  const answer = trimmedString(body.answer);

  if (question.length < 1 || question.length > 500) {
    addError(errors, "question", "問題は1〜500文字で入力してください。");
  }
  if (answer.length < 1 || answer.length > 2000) {
    addError(errors, "answer", "答えは1〜2000文字で入力してください。");
  }

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { question, answer } };
}

export function validatePositiveIntegerId(
  value: unknown,
): ValidationResult<number> {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? { success: true, data: value }
    : {
        success: false,
        errors: { id: ["idには正の整数を指定してください。"] },
      };
}

export function validateStudyLogInput(
  body: Record<string, unknown>,
): ValidationResult<StudyLogInput> {
  const errors: Record<string, string[]> = {};
  const clientSessionId = trimmedString(body.clientSessionId).toLowerCase();
  const subject = trimmedString(body.subject);
  const durationSeconds = body.durationSeconds;
  const startedAt =
    typeof body.startedAt === "string" ? new Date(body.startedAt) : new Date(NaN);
  const endedAt =
    typeof body.endedAt === "string" ? new Date(body.endedAt) : new Date(NaN);

  if (!UUID_V4_PATTERN.test(clientSessionId)) {
    addError(
      errors,
      "clientSessionId",
      "clientSessionIdにはUUID v4を指定してください。",
    );
  }
  if (subject.length < 1 || subject.length > 100) {
    addError(errors, "subject", "科目は1〜100文字で入力してください。");
  }
  if (
    typeof durationSeconds !== "number" ||
    !Number.isSafeInteger(durationSeconds) ||
    durationSeconds < 1 ||
    durationSeconds > 86_400
  ) {
    addError(errors, "durationSeconds", "学習時間は1〜86400秒で指定してください。");
  }
  if (Number.isNaN(startedAt.getTime())) {
    addError(errors, "startedAt", "有効な開始日時を指定してください。");
  }
  if (Number.isNaN(endedAt.getTime())) {
    addError(errors, "endedAt", "有効な終了日時を指定してください。");
  }

  if (!Number.isNaN(startedAt.getTime()) && !Number.isNaN(endedAt.getTime())) {
    const wallSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
    if (wallSeconds < 1) {
      addError(errors, "endedAt", "終了日時は開始日時より後にしてください。");
    }
    if (typeof durationSeconds === "number" && durationSeconds > wallSeconds + 5) {
      addError(
        errors,
        "durationSeconds",
        "学習時間は開始日時から終了日時までの範囲内にしてください。",
      );
    }
    if (endedAt.getTime() > Date.now() + 5 * 60 * 1000) {
      addError(errors, "endedAt", "終了日時に未来の時刻は指定できません。");
    }
  }

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : {
        success: true,
        data: {
          clientSessionId,
          subject,
          durationSeconds: durationSeconds as number,
          startedAt,
          endedAt,
        },
      };
}
