import { Link } from "react-router-dom";

export default function Home() {
  // Example list of users (you can fetch from API later)
  const users = [
    { id: "0b7ddbc8-ec37-4f93-9f45-058a79c3350c", name: "open newtork" },
    { id: "d985266e-86e9-4845-8634-8700df00ee30", name: "professional" },
    { id: "9feecc1f-0f6e-4ad5-90be-f54966cd71c2", name: "service" },
    { id: "b5a9da2d-b15f-48b2-b48c-44b23792f34d", name: "business" },
    { id: "testing", name: "event" },
  ];

  return (
    <div style={{  maxWidth: "600px", margin: "auto" }}>
      <h1>Profiles</h1>
      <ul>
        {users.map(user => (
          <li key={user.id} >
            <Link to={`/u/${user.id}`}>View {user.name}'s Profile</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
