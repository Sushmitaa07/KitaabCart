import React, { useState } from "react";
import "./Subform.css";

const Subform = () => {
  const [webDev, setWebDev] = useState("");
  const [softwareDev, setSoftwareDev] = useState("");
  const [kotlin, setKotlin] = useState("");
  const [dsa, setDsa] = useState("");
  const [result, setResult] = useState("");

  const calculateGrade = () => {
    const marks = [webDev, softwareDev, kotlin, dsa].map(Number);

    if (marks.some(mark => isNaN(mark) || mark < 0 || mark > 100)) {
      setResult("Please enter valid marks between 0 and 100 for all subjects.");
      return;
    }

    const average = marks.reduce((a, b) => a + b, 0) / marks.length;
    let grade = "";
    let status = average >= 40 ? "Pass" : "Fail";

    if (average >= 90) grade = "A+";
    else if (average >= 80) grade = "A";
    else if (average >= 70) grade = "B";
    else if (average >= 60) grade = "C";
    else if (average >= 50) grade = "D";
    else grade = "F";

    setResult(`Percentage: ${average.toFixed(2)}% | Grade: ${grade} | Status: ${status}`);
  };

  return (
    <div className="subform">
      <h2>Enter Marks</h2>
      <input
        type="number"
        placeholder="Web Development"
        value={webDev}
        onChange={(e) => setWebDev(e.target.value)}
      />
      <input
        type="number"
        placeholder="Software Development"
        value={softwareDev}
        onChange={(e) => setSoftwareDev(e.target.value)}
      />
      <input
        type="number"
        placeholder="Kotlin"
        value={kotlin}
        onChange={(e) => setKotlin(e.target.value)}
      />
      <input
        type="number"
        placeholder="DSA"
        value={dsa}
        onChange={(e) => setDsa(e.target.value)}
      />
      <button onClick={calculateGrade}>Calculate Grade</button>
      <div className="result">{result}</div>
    </div>
  );
};

export default Subform;