export default function Container({ className, children }) {
  return <div className={`${className} text-white bg-gradient-to-br from-white/40  to-white/10 backdrop-blur-[2px]  rounded-xl shadow-md`}>{children}</div>;
}
