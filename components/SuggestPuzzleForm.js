import { useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust if path differs

export default function SuggestPuzzleForm() {
  const [formData, setFormData] = useState({
    number: "",
    answer: "",
    displayName: "",
    location: "",
    email: "",
    wantsUpdates: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { number, answer, displayName, location, email, wantsUpdates } = formData;

    if (!number || !answer || !displayName || !location || !email) {
      setError("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("puzzle_submissions").insert([
      {
        number,
        answer,
        display_name: displayName,
        location,
        email,
        wants_updates: wantsUpdates,
      },
    ]);

    if (error) {
      console.error("Submission error:", error);
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <p className="text-green-600 text-center">🎉 Thanks! Your puzzle has been submitted.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        name="number"
        placeholder="Number (e.g. 42, 3.14)"
        value={formData.number}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="answer"
        placeholder="What does the number represent?"
        value={formData.answer}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="displayName"
        placeholder="Your name (for credit)"
        value={formData.displayName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="location"
        placeholder="Your location (e.g. London)"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email (to notify if selected)"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="wantsUpdates"
          checked={formData.wantsUpdates}
          onChange={handleChange}
        />
        I’d like to receive occasional game updates
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Puzzle
      </button>
    </form>
  );
}
