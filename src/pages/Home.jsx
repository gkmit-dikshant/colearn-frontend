export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-4">
            Collaborate. Build. Learn.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Find collaborators, join projects, learn skills, and work with
            experts.
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-12 text-center">
            How it Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                List Your Idea
              </h3>
              <p className="text-sm text-gray-600">Users can post a project.</p>
            </div>
            <div className="bg-white border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Join a Project
              </h3>
              <p className="text-sm text-gray-600">
                Users can explore projects requiring skills.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
