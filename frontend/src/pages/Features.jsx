import React from 'react'
import doctorimg from "../assets/doctorimg.png"

function Features() {
 return (
  <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 py-24">

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
        "The most secure way for my patients to
        <span className="text-cyan-200"> share their medical history.</span>"
      </h2>

      <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto leading-8">
        HealthConnect has transformed the way I access patient records.
        Everything is secure, organized, and available exactly when I need it.
      </p>

      {/* Doctor */}
      <div className="mt-10 flex flex-col items-center">

        <img
          src={doctorimg}
          alt="Dr. James Wilson"
          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-2xl"
        />

        <h3 className="mt-5 text-2xl font-bold">
          Dr. James Wilson
        </h3>

        <p className="mt-1 text-blue-100 font-medium tracking-wide">
          Cardiologist • St. Jude's Hospital
        </p>

      </div>

    </div>
  </section>
)
}

export default Features
