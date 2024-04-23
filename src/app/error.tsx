"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};
export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-screen-lg mx-auto w-full p-3 md:p-6 py-9 md:py-16 flex flex-col gap-3">
      <h2>Terjadi kesalahan</h2>
      <p>
        Terjadi kesalahan saat memuat halaman ini.
        <br />
        Silahkan coba lagi atau hubungi kami jika masalah berlanjut.
      </p>
      <div className="flex items-center flex-col md:flex-row gap-3">
        <Button variant={"secondary"} className="md:w-fit" onClick={reset}>
          Coba Lagi
        </Button>
        <Button asChild className="md:w-fit">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
