import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black px-4 py-16">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              card: 'shadow-none bg-transparent',
              headerTitle: 'text-2xl font-bold text-center text-gray-900 dark:text-white',
              headerSubtitle: 'text-sm text-muted-foreground mb-4 text-center',
              formFieldLabel: 'text-sm font-medium text-gray-700 dark:text-gray-300',
              formFieldInput:
                'w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 text-sm text-gray-900 dark:text-white',
              socialButtonsBlockButton:
                'flex justify-center items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 dark:text-white',
              footerActionText: 'text-sm text-muted-foreground text-center',
              footerActionLink: 'text-primary font-semibold hover:underline',
            },
            variables: { 
              colorPrimary: '#6366f1',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              borderRadius: '0.75rem',
            },
          }}
        />
      </div>
    </main>
  )
}
  
