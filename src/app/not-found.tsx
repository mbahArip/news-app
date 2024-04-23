import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-screen-lg mx-auto w-full p-3 md:p-6 py-9 md:py-16 flex flex-col gap-3">
      <h2>Halaman tidak ditemukan</h2>
      <p>
        Kita tidak bisa menemukan halaman yang anda coba akses.
        <br />
        Silahkan periksa kembali URL yang anda masukkan.
      </p>
      <Button asChild className="w-fit">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
