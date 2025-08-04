import { Lightbulb, Rocket, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-green-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">We Built TaskPilot for Teams That Care</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          From freelancers to enterprises, our mission is to help people do more with less chaos.
        </p>
      </section>

    <section className="bg-[#f9fafb] py-24 px-6 text-center text-gray-800">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-snug">
            Why TaskPilot Exists
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            Project management tools were either <span className="font-semibold text-green-600">too complex</span> or <span className="font-semibold text-green-600">too limited</span>.
            We wanted something that was easy, powerful, and actually enjoyable to use.
            </p>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            That’s why we created <span className="font-semibold text-gray-900">TaskPilot</span> - a tool that feels just right. It’s designed to bring clarity, focus, and balance
            to every team’s workflow.
            </p>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-8 mt-10">
            <p className="text-xl italic text-green-700 font-medium">
                "Beautiful. Simple. Focused."
            </p>
            <p className="text-sm text-gray-500 mt-2">- The TaskPilot Philosophy</p>
            </div>
        </div>
    </section>


      {/* Core Values */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-600 text-lg">
            The principles that guide everything we design and build.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Value 1 */}
          <div className="bg-white shadow rounded-2xl p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Clarity</h3>
            <p className="text-gray-600 text-sm">We design with intention, reducing clutter and complexity.</p>
          </div>
          {/* Value 2 */}
          <div className="bg-white shadow rounded-2xl p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Momentum</h3>
            <p className="text-gray-600 text-sm">Helping teams move fast and stay aligned is our top goal.</p>
          </div>
          {/* Value 3 */}
          <div className="bg-white shadow rounded-2xl p-6 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Empathy</h3>
            <p className="text-gray-600 text-sm">We listen to users and build features that actually help.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-white to-green-50">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify your projects?</h2>
        <p className="text-gray-600 mb-6">Start using TaskPilot today - it’s fast, free, and designed for teams like yours.</p>
        <Link
          to="https://project-management-system-1emk.vercel.app/signup"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
