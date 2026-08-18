import { Suspense } from "react";

export const dynamic = "force-dynamic";

function RegisterForm() {
  // isi komponen register kamu yang lama (yang pakai useSearchParams) ada di sini
  return <div>{/* kode register kamu */}</div>;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
