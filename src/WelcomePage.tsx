import { motion } from "framer-motion";
import { Link } from "react-router";

export default function K3HeroSection() {
  return (
    <div className='relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center'>
      <div className='px-4 py-10 md:py-20'>
        {/* Selamat Datang Text */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='mb-4 text-center text-7xl font-bold text-slate-700'>
          Welcome
        </motion.h2>

        {/* Title with split animation */}
        <h1 className='relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300'>
          {"Prioritizing Safety and Health in Every Workplace"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className='mr-2 inline-block'>
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className='relative z-10 mx-auto max-w-xl py-4 text-center text-2xl font-normal text-neutral-600 dark:text-neutral-400'>
          Tingkatkan budaya kerja yang aman dan sehat dengan peduli K3,
          inspeksi berkala, serta sistem pelaporan yang terintegrasi.
        </motion.p>

        {/* Tombol Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className='relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4'>
          <Link to='/login'>
            <a className='w-60 transform rounded-lg bg-black px-10 py-4 text-2xl text-center font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
              Login
            </a>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
