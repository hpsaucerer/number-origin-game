import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
      setError("Please complete all fields.");
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
      console.error(error);
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <p className="text-green-700 mt-4">🎉 Thanks for your submission!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Suggest a Puzzle</h2>

      <input
        type="text"
        name="number"
        placeholder="Enter a number"
        className="w-full p-2 border rounded"
        value={formData.number}
        onChange={handleChange}
      />
      <input
        type="text"
        name="answer"
        placeholder="What does it represent?"
        className="w-full p-2 border rounded"
        value={formData.answer}
        onChange={handleChange}
      />
      <input
        type="text"
        name="displayName"
        placeholder="Your name"
        className="w-full p-2 border rounded"
        value={formData.displayName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Your location"
        className="w-full p-2 border rounded"
        value={formData.location}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email address"
        className="w-full p-2 border rounded"
        value={formData.email}
        onChange={handleChange}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="wantsUpdates"
          checked={formData.wantsUpdates}
          onChange={handleChange}
        />
        I’d like to receive updates about the game.
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Suggestion
      </button>
    </form>
  );
}
