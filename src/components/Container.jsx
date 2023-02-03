import { motion } from 'framer-motion';

export default function Container({ className, children, bg = 'backdrop-blur-[2px]' }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className={`${className} ${bg} text-white rounded-lg shadow-md`}>
      {children}
    </motion.div>
  );
}
