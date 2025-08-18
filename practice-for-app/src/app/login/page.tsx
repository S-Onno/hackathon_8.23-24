/**
 * ログインページです！
 */
import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    /**
     * ログインコンポーネントに飛ばします
     * ログインフォームで変更点がある場合、LoginForm.tsxに記述してください。
     */
    <LoginForm />
  );
}
