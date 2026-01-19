import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function Error404() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <>
      <Head title="404 - Page Not Found" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-xl">
          {/* 404 Number */}
          <h1 className="text-[180px] md:text-[220px] font-bold text-primary leading-none mb-8">
            404
          </h1>

          {/* Yellow underline */}
          <div className="w-64 h-2 bg-sidebar-accent mx-auto mb-12" />

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-10">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-xl mb-14 leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
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
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
