"use client";
export default function Footer() {
  return (
    <footer className="w-full mt-6 px-6 py-3 flex items-center justify-center bg-secondary text-secondary-foreground">
      <p className="text-center text-sm">&copy; {new Date().getFullYear()} Beritaku. All rights reserved.</p>
    </footer>
  );
}
