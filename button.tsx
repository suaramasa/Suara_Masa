export function Button({ children, onClick, variant = "default" }: any) {
  const styles =
    variant === "destructive"
      ? "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      : variant === "outline"
      ? "border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200"
      : "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700";

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
