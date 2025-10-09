import TypeIt from 'typeit-react';
import type { TypewriterProps } from './use-typewriter-text.tsx';
import useTypewriterText from './use-typewriter-text.tsx';

const Typewriter = (props: TypewriterProps) => {
  const { className, ...otherTypeItProps } = props;

  return <TypeIt className={className} {...otherTypeItProps} />;
};
export default Typewriter;
// eslint-disable-next-line react-refresh/only-export-components
export { useTypewriterText };
