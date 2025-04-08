import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";

const App = () => {
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    classDivision: "",
    allergies: [],
    photoURL: "",
    rackNumber: "",
    busRoute: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [template, setTemplate] = useState("classic");
  const cardRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      allergies: checked
        ? [...prev.allergies, value]
        : prev.allergies.filter((a) => a !== value),
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, photoURL }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const downloadAsImage = () => {
    if (cardRef.current) {
      toPng(cardRef.current).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${form.name}_IDCard.png`;
        link.href = dataUrl;
        link.click();
      });
    }
  };

  // Templates

  
  const templates = {
    classic: "bg-white border border-blue-500 shadow-xl",
    modern:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700">
        🎓 Student ID Card Generator
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <select
              name="classDivision"
              value={form.classDivision}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Class & Division</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
              <option value="11-A">11-A</option>
              <option value="11-B">11-B</option>
            </select>
            <select
              name="busRoute"
              value={form.busRoute}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Bus Route</option>
              <option value="Route A">Route A</option>
              <option value="Route B">Route B</option>
              <option value="Route C">Route C</option>
            </select>
            <input
              type="text"
              name="rackNumber"
              placeholder="Rack Number"
              value={form.rackNumber}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <div>
              <label className="block mb-1 font-semibold">Allergies:</label>
              <div className="flex flex-wrap gap-2">
                {["Peanuts", "Dairy", "Gluten", "Dust", "Other"].map(
                  (allergy) => (
                    <label
                      key={allergy}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={allergy}
                        onChange={handleAllergyChange}
                        checked={form.allergies.includes(allergy)}
                      />
                      {allergy}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Upload Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              required
            />
            {form.photoURL && (
              <img
                src={form.photoURL}
                alt="preview"
                className="mt-2 w-24 h-24 rounded-full border object-cover"
              />
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Select Template:</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Generate ID
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div
            ref={cardRef}
            className={`w-96 p-6 rounded-xl ${templates[template]}`}
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {template === "classic" ? "Student ID Card" : "Digital ID"}
            </h2>
            <div className="flex flex-col items-center text-center space-y-2">
              {form.photoURL && (
                <img
                  src={form.photoURL}
                  alt="student"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                />
              )}
              <p>
                <strong>Name:</strong> {form.name}
              </p>
              <p>
                <strong>Roll No:</strong> {form.rollNumber}
              </p>
              <p>
                <strong>Class:</strong> {form.classDivision}
              </p>
              <p>
                <strong>Rack:</strong> {form.rackNumber}
              </p>
              <p>
                <strong>Bus Route:</strong> {form.busRoute}
              </p>
              {form.allergies.length > 0 && (
                <p>
                  <strong>Allergies:</strong> {form.allergies.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadAsImage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download PNG
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Back To Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

