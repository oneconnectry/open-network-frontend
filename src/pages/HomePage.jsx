import { Link } from "react-router-dom";

export default function Home() {
  // Example list of users (you can fetch from API later)
  const users = [
    { id: "0b7ddbc8-ec37-4f93-9f45-058a79c3350c", name: "open network" },
    { id: "d985266e-86e9-4845-8634-8700df00ee30", name: "professional" },
    { id: "9feecc1f-0f6e-4ad5-90be-f54966cd71c2", name: "service" },
    { id: "2dd7233b-f6ea-4d3e-b5d2-9b680fd7d556", name: "business" },
    { id: "testing", name: "event" },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Profiles</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "10px" }}>
            <Link to={`/u/${user.id}`}>
              View {user.name}'s Profile
            </Link>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "30px 0" }} />

      <h2>Verification</h2>

      <Link
        to="/face-verify"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          background: "#2563eb",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
        }}
      >
        Open Face Verification
      </Link>
    </div>
  );
}