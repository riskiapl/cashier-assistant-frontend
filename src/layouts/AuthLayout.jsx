export default function AuthLayout(props) {
  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full p-6">{props.children}</div>
    </div>
  );
}
