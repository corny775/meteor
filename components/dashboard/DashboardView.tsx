'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useDynamicNASAData } from '@/lib/hooks/useDynamicNASAData';
import DashboardMain from './DashboardMain';
import OrbitalView from './OrbitalView';
import DefendEarthMode from './DefendEarthMode';
import { RefreshCw, AlertCircle } from 'lucide-react';

const viewVariants = {
  enter: { opacity: 0, x: 50, scale: 0.95 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.95 },
};

export default function DashboardView() {
  const { activeView } = useAppStore();
  const { isLoading, error, lastUpdated, refetch } = useDynamicNASAData();

  return (
    <div className="pt-24 pb-8 min-h-screen bg-gradient-to-b from-space-dark via-space-blue/20 to-space-dark">
      {/* Data Status Bar */}
      <div className="container mx-auto px-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism border border-white/10 rounded-xl p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 text-space-cyan animate-spin" />
                <span className="text-sm text-gray-300">Loading NASA data...</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">{error}</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-300">
                  Live data • Last updated:{' '}
                  {lastUpdated
                    ? new Date(lastUpdated).toLocaleTimeString()
                    : 'Never'}
                </span>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            disabled={isLoading}
            className="px-3 py-1 bg-space-cyan/20 border border-space-cyan/50 rounded-lg text-space-cyan text-sm hover:bg-space-cyan/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </motion.div>
      </div>

      {/* View Content with Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          variants={viewVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {activeView === 'dashboard' && <DashboardMain />}
          {activeView === 'orbital' && <OrbitalView />}
          {activeView === 'defend-earth' && <DefendEarthMode />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
