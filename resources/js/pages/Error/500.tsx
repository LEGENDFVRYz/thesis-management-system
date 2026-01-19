import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function Error500() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <>
      <Head title="500 - Internal Server Error" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-xl">
          {/* 500 Number */}
          <h1 className="text-[180px] md:text-[220px] font-bold text-primary leading-none mb-8">
            500
          </h1>

          {/* Yellow underline */}
          <div className="w-64 h-2 bg-sidebar-accent mx-auto mb-12" />

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-10">
            Internal Server Error
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-xl mb-14 leading-relaxed">
            Oops! Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again later.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              className="px-10 py-3 text-lg"
              onClick={() => window.location.href = '/'}
            >
              Go to Homepage
            </Button>
            <Button
              variant="outline"
              className="px-10 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
