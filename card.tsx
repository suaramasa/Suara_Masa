export function Card({ children, className = "" }: any) {
  return <div className={`bg-white rounded-xl p-4 ${className}`}>{children}</div>;
}

export function CardContent({ children }: any) {
  return <div>{children}</div>;
}
