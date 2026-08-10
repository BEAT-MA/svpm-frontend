import { useInView } from "../lib/hooks.js";

export default function Reveal({ children, as: Tag = "div", delay = 0, className = "", ...rest }) {
  const { ref, inView } = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "reveal--visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
