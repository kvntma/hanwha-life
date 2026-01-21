export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-black text-white italic tracking-tighter uppercase underline decoration-primary underline-offset-8">Beast <span className="text-primary">Tins</span></h1>
        </div>
        {children}
      </div>
    </div>
  );
}
