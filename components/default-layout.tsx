export function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {children}
        </div>
    );
}