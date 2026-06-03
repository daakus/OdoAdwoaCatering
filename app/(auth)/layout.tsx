export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-max min-h-dvh bg-stitch-background text-stitch-on-background antialiased">
      {props.children}
    </div>
  );
}
