import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plus, ArrowUpRight, Clock, Wand2
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-grid dark:bg-grid-dark relative">
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full relative z-10">
          <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none -z-0 rounded-b-[100px]" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}>
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/[0.04] dark:bg-cyan-500/[0.08] rounded-full blur-[100px] transition-colors duration-500 animate-pulse" />
            <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-purple-500/[0.04] dark:bg-purple-500/[0.06] rounded-full blur-[120px] transition-colors duration-500" />
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
                  Hello, {user?.firstName} <span className="animate-bounce inline-block">👋</span>
                </h2>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-2 transition-colors duration-500 font-medium">
                  Welcome back to your creative sanctuary.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                <Clock className="w-3 h-3" />
                Updated 5m ago
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8">
              <div 
                onClick={() => navigate('/sketch')}
                className="group relative bg-white dark:bg-[#16161a] border-dashed-ring p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl dark:hover:shadow-cyan-500/10 hover:border-zinc-400 dark:hover:border-cyan-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent dark:from-cyan-500/[0.03] transition-opacity duration-500" />
                
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-125 transition-transform duration-700" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-zinc-900 dark:bg-cyan-500/10 border border-zinc-800 dark:border-cyan-500/20 flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Wand2 className="w-8 h-8 text-white dark:text-cyan-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4 transition-colors duration-500">
                      Sketch to UI
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl transition-colors duration-500 leading-relaxed font-medium">
                      The magic bridge between your imagination and production-ready code. Start creating your next big thing.
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 border border-zinc-200 dark:border-white/[0.1] text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-900 dark:group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-black group-hover:border-zinc-900 dark:group-hover:border-transparent transition-all duration-500">
                    <ArrowUpRight className="w-8 h-8" />
                  </div>
                </div>
                
                {/* Decorative Dashed Line Pattern */}
                <div className="absolute bottom-0 left-0 w-full h-1 border-t border-dashed border-zinc-200 dark:border-white/[0.05]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
