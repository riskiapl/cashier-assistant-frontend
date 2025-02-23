import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <button type="submit" class="w-full btn btn-primary">
        Login
      </button>
    </form>
  );
}
