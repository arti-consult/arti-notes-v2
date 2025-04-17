export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ARTI Notes. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Version 2.0.0</p>
        </div>
      </div>
    </footer>
  );
}
