import React from 'react'

function Features() {
 return (
  <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-14">

    {/* Background Blur Effects */}
    <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
    <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"></div>

    <div className="relative max-w-4xl mx-auto px-6 text-center text-white">

      {/* Quote Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
        <span className="text-4xl font-bold">❝</span>
      </div>

      {/* Testimonial */}
      <h2 className="mt-8 text-3xl md:text-5xl font-bold leading-relaxed">
        "The most secure way for patients to
        <span className="text-cyan-200"> share their medical history.</span>"
      </h2>

      <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto leading-8">
        HealthConnect has transformed the way Doctor access patient records.
        Everything is secure, organized, and available exactly when Doctor need it.
      </p>
    </div>
  </section>
)
}

export default Features
